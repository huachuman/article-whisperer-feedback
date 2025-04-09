
# WordPress Integration Guide - Step by Step

## Overview

This guide will help you add the Article Feedback component to your WordPress site. The system adds a hoverable feedback icon to paragraphs in your articles.

## Option 1: As a WordPress Plugin (Recommended for Most Users)

### Step 1: Create the Plugin Files
1. In your WordPress installation, go to `/wp-content/plugins/`
2. Create a new folder named `article-feedback`
3. Inside that folder, create these files:

**article-feedback.php**
```php
<?php
/**
 * Plugin Name: Article Feedback
 * Description: Adds paragraph-level feedback to your articles
 * Version: 1.0.0
 * Author: Your Name
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

// Enqueue scripts and styles
function article_feedback_enqueue_scripts() {
    // Only load on single posts/pages
    if (is_single() || is_page()) {
        wp_enqueue_script(
            'article-feedback-js',
            plugin_dir_url(__FILE__) . 'assets/js/article-feedback.js',
            array('react', 'react-dom'),
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
            'articleSelector' => '.entry-content' // Default WordPress content selector
        ));
    }
}
add_action('wp_enqueue_scripts', 'article_feedback_enqueue_scripts');

// Add WordPress AJAX endpoint
function article_feedback_submit() {
    // Verify nonce
    if (!check_ajax_referer('article_feedback_nonce', 'nonce', false)) {
        wp_send_json_error('Invalid security token');
    }
    
    // Get POST data
    $post_id = absint($_POST['postId']);
    $feedback_type = sanitize_text_field($_POST['feedbackType']);
    $selected_text = sanitize_textarea_field($_POST['selectedText']);
    $additional_info = sanitize_textarea_field($_POST['additionalInfo']);
    
    // Store feedback in database
    $feedback_id = wp_insert_post(array(
        'post_type' => 'article_feedback',
        'post_status' => 'private',
        'post_title' => 'Feedback for Post #' . $post_id,
        'meta_input' => array(
            'post_id' => $post_id,
            'feedback_type' => $feedback_type,
            'selected_text' => $selected_text,
            'additional_info' => $additional_info
        )
    ));
    
    // Send response
    if ($feedback_id) {
        wp_send_json_success(array('id' => $feedback_id));
    } else {
        wp_send_json_error('Failed to save feedback');
    }
    
    wp_die(); // Required to terminate properly
}
add_action('wp_ajax_article_feedback_submit', 'article_feedback_submit'); // For logged in users
add_action('wp_ajax_nopriv_article_feedback_submit', 'article_feedback_submit'); // For non-logged in users

// Register custom post type for feedback
function article_feedback_register_post_type() {
    register_post_type('article_feedback', array(
        'labels' => array(
            'name' => 'Article Feedback',
            'singular_name' => 'Feedback'
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

### Step 2: Create Asset Folders
1. Inside the `article-feedback` folder, create an `assets` folder
2. Inside `assets`, create two folders: `js` and `css`

### Step 3: Build and Copy the JavaScript
1. Run `npm run build` on your local copy of this project
2. Copy the resulting `.js` file from the `dist` folder to `wp-content/plugins/article-feedback/assets/js/article-feedback.js`
3. Copy the resulting `.css` file from the `dist` folder to `wp-content/plugins/article-feedback/assets/css/article-feedback.css`

### Step 4: Activate the Plugin
1. Log in to your WordPress admin dashboard
2. Go to Plugins > Installed Plugins
3. Find "Article Feedback" and click "Activate"

### Step 5: Test and Configure
1. Visit any post or page on your site
2. Hover over paragraphs - you should see the feedback icon appear
3. Submit a test feedback to ensure it works properly
4. Check your admin area under "Article Feedback" menu to see collected feedback

## Option 2: Manual Integration into Your Theme

If you have a custom theme and want more control:

### Step 1: Copy the Build Files
1. Build the project using `npm run build`
2. Copy the resulting JS and CSS files to your theme directory, perhaps in a `js` and `css` folder

### Step 2: Enqueue in functions.php
Add this to your theme's `functions.php`:

```php
function enqueue_article_feedback() {
    if (is_single() || is_page()) {
        wp_enqueue_script(
            'article-feedback-js',
            get_template_directory_uri() . '/js/article-feedback.js',
            array('react', 'react-dom'),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'article-feedback-css',
            get_template_directory_uri() . '/css/article-feedback.css',
            array(),
            '1.0.0'
        );
        
        wp_localize_script('article-feedback-js', 'articleFeedbackData', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('article_feedback_nonce'),
            'postId' => get_the_ID(),
            'articleSelector' => '.entry-content' // Adjust to match your theme
        ));
    }
}
add_action('wp_enqueue_scripts', 'enqueue_article_feedback');

// Then add the AJAX handlers and custom post type as in Option 1
```

### Step 3: Add Container Element (Optional)
If needed, modify your theme's `single.php` or relevant template to ensure the article content has the appropriate selector:

```php
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="entry-content">
        <?php the_content(); ?>
    </div>
</article>
```

## Troubleshooting

**The feedback icon doesn't appear**
- Check browser console for errors
- Verify the article selector matches your theme's content container
- Make sure the JS/CSS files are loaded properly

**Feedback isn't being saved**
- Verify AJAX URL is correct
- Check WordPress error logs
- Ensure proper permissions on server directories

**Icons display incorrectly**
- Make sure all CSS is properly loaded
- Check for CSS conflicts with your theme

## Customizing

To change the selector used to identify paragraphs, modify the `articleSelector` value in the `wp_localize_script` function.
