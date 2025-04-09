
# WordPress Integration Guide for Article Feedback

This document explains how to integrate the Article Feedback component into your WordPress site.

## Integration Options

### 1. As a WordPress Plugin (Recommended)

1. **Create a WordPress plugin folder structure**:
   ```
   article-feedback/
   ├── article-feedback.php
   ├── assets/
   │   ├── js/
   │   │   └── article-feedback.js  (compiled React app)
   │   └── css/
   │       └── article-feedback.css (compiled styles)
   ```

2. **Main plugin file** (`article-feedback.php`):

```php
<?php
/**
 * Plugin Name: Article Feedback
 * Description: Adds a feedback mechanism to article content
 * Version: 1.0.0
 * Author: Your Name
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

function article_feedback_enqueue_scripts() {
    // Only load on single posts/pages
    if (is_single() || is_page()) {
        wp_enqueue_script(
            'article-feedback-js',
            plugin_dir_url(__FILE__) . 'assets/js/article-feedback.js',
            array(),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'article-feedback-css',
            plugin_dir_url(__FILE__) . 'assets/css/article-feedback.css',
            array(),
            '1.0.0'
        );
        
        // Pass WordPress data to JavaScript
        wp_localize_script('article-feedback-js', 'articleFeedbackData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('article_feedback_nonce'),
            'postId' => get_the_ID(),
            'articleSelector' => '.entry-content' // Default WordPress article content selector
        ));
    }
}
add_action('wp_enqueue_scripts', 'article_feedback_enqueue_scripts');

// Create REST API endpoint to handle feedback submission
function article_feedback_register_rest_route() {
    register_rest_route('article-feedback/v1', '/submit', array(
        'methods' => 'POST',
        'callback' => 'article_feedback_submit',
        'permission_callback' => function() {
            return true; // Public endpoint
        },
    ));
}
add_action('rest_api_init', 'article_feedback_register_rest_route');

function article_feedback_submit($request) {
    // Validate nonce
    if (!wp_verify_nonce($request->get_header('X-WP-Nonce'), 'article_feedback_nonce')) {
        return new WP_Error('invalid_nonce', 'Invalid nonce', array('status' => 403));
    }
    
    $data = $request->get_json_params();
    
    // Sanitize data
    $post_id = absint($data['postId']);
    $feedback_type = sanitize_text_field($data['feedbackType']);
    $selected_text = sanitize_textarea_field($data['selectedText']);
    $additional_info = sanitize_textarea_field($data['additionalInfo']);
    
    // Store feedback in database (example)
    $feedback_id = wp_insert_post(array(
        'post_type' => 'article_feedback',
        'post_title' => 'Feedback for Post #' . $post_id,
        'post_status' => 'private',
        'meta_input' => array(
            'post_id' => $post_id,
            'feedback_type' => $feedback_type,
            'selected_text' => $selected_text,
            'additional_info' => $additional_info
        )
    ));
    
    if (is_wp_error($feedback_id)) {
        return new WP_Error('error_saving', 'Error saving feedback', array('status' => 500));
    }
    
    return array(
        'success' => true,
        'feedback_id' => $feedback_id
    );
}

// Register a custom post type for feedback (optional)
function article_feedback_register_post_type() {
    register_post_type('article_feedback', array(
        'labels' => array(
            'name' => 'Article Feedback',
            'singular_name' => 'Article Feedback'
        ),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'capability_type' => 'post',
        'has_archive' => false,
        'hierarchical' => false,
        'menu_icon' => 'dashicons-feedback',
        'supports' => array('title')
    ));
}
add_action('init', 'article_feedback_register_post_type');
```

3. **Build your React app** for WordPress:
   - Compile your React components into a single JS file
   - Extract CSS into its own file
   - Place compiled assets in the plugin's assets directory

4. **Add a container div** in your theme's content template if needed (this step might be optional depending on your theme structure):

```php
function article_feedback_add_container($content) {
    if (is_single() || is_page()) {
        $content .= '<div id="article-feedback-root"></div>';
    }
    return $content;
}
add_filter('the_content', 'article_feedback_add_container');
```

### 2. As Part of a React-Based WordPress Theme

If your WordPress theme already uses React (like using Frontity, Headless WordPress, or a custom React theme):

1. Import the components directly:
```jsx
import WordpressArticleFeedback from './WordpressArticleFeedback';

// In your article component
function Article() {
  return (
    <>
      <div className="article-content">
        {/* Article content */}
      </div>
      <WordpressArticleFeedback articleSelector=".article-content" />
    </>
  );
}
```

2. Configure your backend endpoint to handle feedback submissions.

## Customization Options

- Adjust the `articleSelector` prop to match your theme's article content container
- Modify the styling in your CSS to match your theme
- Change which elements can receive feedback by modifying the `selectors` array

## Security Considerations

- Always validate and sanitize user input
- Use WordPress nonces to prevent CSRF attacks
- Consider rate limiting feedback submissions to prevent spam
- Store user IP addresses and timestamps to track abuse
