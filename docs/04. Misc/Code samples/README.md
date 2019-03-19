@@todo

```php

'an-id' => array(
	'setting' => array(
		'default' => 'I am managed by the Theme Mods API',
		'type' => 'setting',
	),
	'control' => array(
		'type' => 'kkcp_text'
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'I am managed by the Options API',
		'type' => 'setting',
	),
	'control' => array(
		'type' => 'kkcp_text'
	),
),

'an-id' => array(
	'setting' => array(
			'default' => 'transparent',
		),
		'control' => array(
			'label' => esc_html__( 'Color', 'i18n' ),
			'type' => 'kkcp_color',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '#f00',
	),
	'control' => array(
		'label' => esc_html__( 'Disallow Transparent', 'i18n' ),
		'type' => 'kkcp_color',
		'transparent' => false,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'rgba(0,255,130,.5)',
	),
	'control' => array(
		'label' => esc_html__( 'Allow Alpha', 'i18n' ),
		'type' => 'kkcp_color',
		'alpha' => true,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '#444',
	),
	'control' => array(
		'label' => esc_html__( 'Palette only', 'i18n' ),
		'type' => 'kkcp_color',
		'palette_only' => true,
		'palette' => array(
			array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '#d9ead3',
	),
	'control' => array(
		'label' => esc_html__( 'Palette and picker', 'i18n' ),
		'type' => 'kkcp_color',
		'palette' => array(
			array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '#fce5cd',
	),
	'control' => array(
		'label' => esc_html__( 'Palette and hidden color picker', 'i18n' ),
		'type' => 'kkcp_color',
		'picker' => 'hidden',
		'palette' => array(
			array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
			array( '#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f' ),
			array( '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc' ),
			array( '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '14px',
	),
	'control' => array(
		'label' => esc_html__( 'Slider (default->px)', 'i18n' ),
		'type' => 'kkcp_slider',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '1.1em',
	),
	'control' => array(
		'label' => esc_html__( 'Slider (em)', 'i18n' ),
		'type' => 'kkcp_slider',
		'units' => array( 'em' ),
		'input_attrs' => array(
			'min' => 0,
			'max' => 3,
			'step' => 0.1,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '15%',
	),
	'control' => array(
		'label' => esc_html__( 'Slider (px or percent)', 'i18n' ),
		'type' => 'kkcp_slider',
		'units' => array( 'px', '%' ),
		'input_attrs' => array(
			'min' => 0,
			'max' => 300,
			'step' => 1,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 44,
	),
	'control' => array(
		'label' => esc_html__( 'Slider (no units)', 'i18n' ),
		'type' => 'kkcp_slider',
		'units' => array(),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'standard',
	),
	'control' => array(
		'label' => esc_html__( 'Radio', 'i18n' ),
		'type' => 'kkcp_radio',
		'choices' => array(
			'standard' => array(
				'label' => esc_html__( 'Standard', 'i18n' ),
				'help' => 'popover',
				'help_title' => esc_html__( 'Standard value', 'i18n' ),
				'help_img' => 'view-skeleton--bootstrap.jpg',
			),
			'one' => array(
				'label' => esc_html__( 'Choice one', 'i18n' ),
			),
			'two' => array(
				'label' => esc_html__( 'Choice two', 'i18n' ),
			),
			'three' => array(
				'label' => esc_html__( 'Choice three', 'i18n' ),
			),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'boxed',
	),
	'control' => array(
		'label' => esc_html__( 'Buttonset', 'i18n' ),
		'type' => 'kkcp_buttonset',
		'choices' => array(
			'boxed' => esc_html__( 'Boxed', 'i18n' ),
			'fluid' => esc_html__( 'Fluid', 'i18n' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'boxed',
	),
	'control' => array(
		'label' => esc_html__( 'Buttonset three', 'i18n' ),
		'type' => 'kkcp_buttonset',
		'choices' => array(
			'may' => esc_html__( 'May', 'i18n' ),
			'ibanez' => esc_html__( 'Ibanez', 'i18n' ),
			'ward' => esc_html__( 'Ward', 'i18n' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'boxed',
	),
	'control' => array(
		'label' => esc_html__( 'Buttonset three', 'i18n' ),
		'type' => 'kkcp_buttonset',
		'choices' => array(
			'one' => esc_html__( 'One', 'i18n' ),
			'two' => esc_html__( 'Two', 'i18n' ),
			'five' => esc_html__( 'Five', 'i18n' ),
			'six' => esc_html__( 'Six', 'i18n' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'less',
	),
	'control' => array(
		'label' => esc_html__( 'Radio image', 'i18n' ),
		'type' => 'kkcp_radio_image',
		'choices' => array(
			'less' => array(
				'label' => esc_html__( 'Single column', 'i18n' ),
				'img' => 'sidebar-less',
			),
			'right' => array(
				'label' => esc_html__( 'Sidebar on the right', 'i18n' ),
				'img' => 'sidebar-right',
			),
			'left' => array(
				'label' => esc_html__( 'Sidebar on the left', 'i18n' ),
				'img' => 'sidebar-left',
			),
			'both' => array(
				'label' => esc_html__( 'Sidebar on both sides', 'i18n' ),
				'img' => 'sidebar-both',
			)
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'firefox',
	),
	'control' => array(
		'label' => esc_html__( 'Radio image (custom)', 'i18n' ),
		'type' => 'kkcp_radio_image',
		'choices' => array(
			'chrome' => array(
				'label' => esc_html__( 'Chrome', 'i18n' ),
				'img_custom' => 'icon-chrome.png',
			),
			'firefox' => array(
				'label' => esc_html__( 'Firefox', 'i18n' ),
				'img_custom' => 'icon-firefox.png',
			),
			'ie' => array(
				'label' => esc_html__( 'IE', 'i18n' ),
				'img_custom' => 'icon-ie.png',
			),
			'opera' => array(
				'label' => esc_html__( 'Opera', 'i18n' ),
				'img_custom' => 'icon-opera.png',
			),
			'safari' => array(
				'label' => esc_html__( 'Safari', 'i18n' ),
				'img_custom' => 'icon-safari.png',
			),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 1,
	),
	'control' => array(
		'label' => esc_html__( 'Checkbox', 'i18n' ),
		'input_attrs' => array(
			'label' => esc_html__( 'Something to enable' ),
		),
		'type' => 'kkcp_checkbox',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 1,
	),
	'control' => array(
		'label' => esc_html__( 'Toggle', 'i18n' ),
		'type' => 'kkcp_toggle',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 1,
	),
	'control' => array(
		'label' => esc_html__( 'Toggle', 'i18n' ),
		'type' => 'kkcp_toggle',
		'input_attrs' => array(
			'label_false' => esc_html__( 'Dark' ),
			'label_true' => esc_html__( 'Light' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => array( 'grape', 'cherry' ),
	),
	'control' => array(
		'label' => esc_html__( 'Multicheck', 'i18n' ),
		'type' => 'kkcp_multicheck',
		'choices' => array(
			'mango' => esc_html__( 'Mango', 'i18n' ),
			'grape' => esc_html__( 'Grape', 'i18n' ),
			'apple' => esc_html__( 'Apple', 'i18n' ),
			'cherry' => esc_html__( 'Cherry', 'i18n' ),
			'banana' => esc_html__( 'Banana', 'i18n' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => array( 'facebook', 'twitter', 'google' ),
	),
	'control' => array(
		'label' => esc_html__( 'Multicheck sortable', 'i18n' ),
		'type' => 'kkcp_multicheck',
		'choices' => array(
			'facebook' => esc_html__( 'Facebook', 'i18n' ),
			'twitter' => esc_html__( 'Twitter', 'i18n' ),
			'google' => esc_html__( 'Google+', 'i18n' ),
			'tumblr' => esc_html__( 'Tumblr', 'i18n' ),
			'linkedin' => esc_html__( 'LinkedIn', 'i18n' ),
			'pinterest' => esc_html__( 'Pinterest', 'i18n' ),
			'reddit' => esc_html__( 'Reddit', 'i18n' ),
			'email' => esc_html__( 'Email', 'i18n' ),
		),
		'sortable' => true,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => array( 'facebook', 'twitter', 'google' ),
	),
	'control' => array(
		'label' => esc_html__( 'Multicheck sortable (max items)', 'i18n' ),
		'type' => 'kkcp_multicheck',
		'choices' => array(
			'mars' => esc_html__( 'Mars', 'i18n' ),
			'venus' => esc_html__( 'Venus', 'i18n' ),
			'earth' => esc_html__( 'Earth', 'i18n' ),
			'jupiter' => esc_html__( 'Jupiter', 'i18n' ),
			'saturn' => esc_html__( 'Saturn', 'i18n' ),
		),
		'sortable' => true,
		'max' => 2,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'Some plain text',
	),
	'control' => array(
		'label' => esc_html__( 'Text', 'i18n' ),
		'type' => 'kkcp_text',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'tenchars !',
	),
	'control' => array(
		'label' => esc_html__( 'Text max length 10', 'i18n' ),
		'type' => 'kkcp_text',
		'input_attrs' => array(
			'maxlength' => 10,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'something',
	),
	'control' => array(
		'label' => esc_html__( 'Text optional', 'i18n' ),
		'type' => 'kkcp_text',
		'optional' => true,
	)
),

'an-id' => array(
	'setting' => array(
		'default' => 'http://myurl.com',
	),
	'control' => array(
		'label' => esc_html__( 'Text URL', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_text',
		'input_attrs' => array(
			'type' => 'url',
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'dev@knitkode.com',
	),
	'control' => array(
		'label' => esc_html__( 'Text Email', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_text',
		'input_attrs' => array(
			'type' => 'email',
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque. Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'input_attrs' => array(
			'maxlength' => 300,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea HTML (escape)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'input_attrs' => array(
			'maxlength' => 300,
			'rows' => 8,
		),
		'html' => 'escape',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '<h3>Lorem ipsum dolor sit amet</h3> <p>Consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque. Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea HTML (dangerous)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'input_attrs' => array(
			'maxlength' => 300,
			'rows' => 8,
		),
		'html' => 'dangerous',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'Only <b>bold</b> and <em>italic</em> tags allowed',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea HTML (filter tags)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'html' => true,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'A post content with <b>html</b>',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea HTML (context)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'html' => 'post',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '<h3>Lorem ipsum dolor sit amet</h3> <p>Consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque.</p>',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea (wp_editor)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'wp_editor' => true,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '<h3>Consectetur adipisicing elit</h3> <p>Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea (wp_editor with options)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'wp_editor' => array(
			'textareaRows' => 7,
			'quicktags' => array(
				'buttons' => 'strong,em',
			)
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => '<h3>No quicktags</h3> <p>Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
	),
	'control' => array(
		'label' => esc_html__( 'Textarea (wp_editor with options)', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_textarea',
		'wp_editor' => array(
			'quicktags' => false,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 4,
	),
	'control' => array(
		'label' => esc_html__( 'Number', 'i18n' ),
		'type' => 'kkcp_number',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 4,
	),
	'control' => array(
		'label' => esc_html__( 'Number', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_number',
		'allowFloat' => true,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 6,
	),
	'control' => array(
		'label' => esc_html__( 'Number min', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_number',
		'input_attrs' => array(
			'min' => 4,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 3,
	),
	'control' => array(
		'label' => esc_html__( 'Number max', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_number',
		'optional' => true,
		'input_attrs' => array(
			'max' => 7,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 15,
	),
	'control' => array(
		'label' => esc_html__( 'Number step', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_number',
		'input_attrs' => array(
			'step' => 5,
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'orange',
	),
	'control' => array(
		'label' => esc_html__( 'Select', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_select',
		'choices' => array(
			'lemon' => esc_html__( 'Lemon', 'i18n' ),
			'orange' => esc_html__( 'Orange', 'i18n' ),
			'pineapple' => esc_html__( 'Pineapple', 'i18n' ),
			'mango' => esc_html__( 'Mango', 'i18n' ),
		),
		'selectize' => false,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'banana',
	),
	'control' => array(
		'label' => esc_html__( 'Selectize', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_select',
		'choices' => array(
			'lemon' => esc_html__( 'Lemon', 'i18n' ),
			'orange' => esc_html__( 'Orange', 'i18n' ),
			'pineapple' => esc_html__( 'Pineapple', 'i18n' ),
			'mango' => esc_html__( 'Mango', 'i18n' ),
			'grape' => esc_html__( 'Grape', 'i18n' ),
			'apple' => esc_html__( 'Apple', 'i18n' ),
			'cherry' => esc_html__( 'Cherry', 'i18n' ),
			'banana' => esc_html__( 'Banana', 'i18n' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'cherry',
	),
	'control' => array(
		'label' => esc_html__( 'Selectize with options', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_select',
		'choices' => array(
			'lemon' => esc_html__( 'Lemon', 'i18n' ),
			'orange' => esc_html__( 'Orange', 'i18n' ),
			'pineapple' => esc_html__( 'Pineapple', 'i18n' ),
			'mango' => esc_html__( 'Mango', 'i18n' ),
			'grape' => esc_html__( 'Grape', 'i18n' ),
			'apple' => esc_html__( 'Apple', 'i18n' ),
			'cherry' => esc_html__( 'Cherry', 'i18n' ),
			'banana' => esc_html__( 'Banana', 'i18n' ),
		),
		'selectize' => array(
			'sortField' => 'text',
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => array( 'IT', 'UK' ),
	),
	'control' => array(
		'label' => esc_html__( 'Selectize with multiple selection', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_select',
		'choices' => array(
			'IT' => esc_html__( 'Italy', 'i18n' ),
			'DE' => esc_html__( 'Germany', 'i18n' ),
			'FR' => esc_html__( 'France', 'i18n' ),
			'UK' => esc_html__( 'United Kingdom', 'i18n' ),
			'NL' => esc_html__( 'Netherlands', 'i18n' ),
			'SP' => esc_html__( 'Spain', 'i18n' ),
		),
		'max' => 3,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => array( 'IT', 'NL', 'UK' ),
	),
	'control' => array(
		'label' => esc_html__( 'Selectize with multiple selection and plugins', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_select',
		'choices' => array(
			'IT' => esc_html__( 'Italy', 'i18n' ),
			'DE' => esc_html__( 'Germany', 'i18n' ),
			'FR' => esc_html__( 'France', 'i18n' ),
			'UK' => esc_html__( 'United Kingdom', 'i18n' ),
			'NL' => esc_html__( 'Netherlands', 'i18n' ),
			'SP' => esc_html__( 'Spain', 'i18n' ),
		),
		'max' => 4,
		'selectize' => array(
			'sortField' => 'text',
			'plugins' => array( 'restore_on_backspace', 'remove_button', 'drag_drop' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'scissors,paper,rock',
	),
	'control' => array(
		'label' => esc_html__( 'Tags', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_tags',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'one,two,three',
	),
	'control' => array(
		'label' => esc_html__( 'Tags removable', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_tags',
		'max' => 4,
		'selectize' => array(
			'plugins' => array( 'restore_on_backspace', 'remove_button' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'milan,rome,venice',
	),
	'control' => array(
		'label' => esc_html__( 'Tags sortable and removable', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_tags',
		'selectize' => array(
			'plugins' => array( 'remove_button', 'drag_drop' )
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'pine,oak',
	),
	'control' => array(
		'label' => esc_html__( 'Tags max items', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_tags',
		'max' => 2,
		'selectize' => array(
			'plugins' => array( 'restore_on_backspace', 'remove_button', 'drag_drop' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => array( 'lemon', 'cherry', 34, 'mango', 'grape' ),
	),
	'control' => array(
		'label' => esc_html__( 'Sortable', 'i18n' ),
		'description' => esc_html__( '', 'i18n' ),
		'type' => 'kkcp_sortable',
		'choices' => array(
			'lemon' => esc_html__( 'Lemon', 'i18n' ),
			34 => '34',
			'mango' => esc_html__( 'Mango', 'i18n' ),
			'grape' => esc_html__( 'Grape', 'i18n' ),
			'cherry' => esc_html__( 'Cherry', 'i18n' ),
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => \"'Helvetica Neue', Helvetica, Arial, sans-serif\",
	),
	'control' => array(
		'label' => esc_html__( 'Font family', 'i18n' ),
		'type' => 'kkcp_font_family',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'Georgia, \"Palatino Linotype\", \"Book Antiqua\", Palatino, \"Times New Roman\", Times, serif',
	),
	'control' => array(
		'label' => esc_html__( 'Font family', 'i18n' ),
		'type' => 'kkcp_font_family',
		'choices' => array(
			'standard' => array(
				'serif',
				'sans-serif'
			)
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'Courier',
	),
	'control' => array(
		'label' => esc_html__( 'One monospace font family', 'i18n' ),
		'type' => 'kkcp_font_family',
		'max' => 1,
		'choices' => array(
			'standard' => 'monospace',
		),
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'bold',
	),
	'control' => array(
		'label' => esc_html__( 'Font weight', 'i18n' ),
		'type' => 'kkcp_font_weight',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'dashboard',
	),
	'control' => array(
		'label' => esc_html__( 'Icon', 'i18n' ),
		'type' => 'kkcp_icon',
		'choices' => 'dashicons',
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'dashboard',
	),
	'control' => array(
		'label' => esc_html__( 'Icon', 'i18n' ),
		'type' => 'kkcp_icon',
		'icons_set' => 'dashicons',
		'max' => 3,
	),
),

'an-id' => array(
	'setting' => array(
		'default' => 'dashboard',
	),
	'control' => array(
		'label' => esc_html__( 'Icon', 'i18n' ),
		'type' => 'kkcp_icon',
		'choices' => array(
			'dashicons' => array( 'admin-plugins', 'admin-users', 'admin-network' ),
		),
	),
),

'kkcp-dummy' => array(
	'control' => array(
		'label' => esc_html__( 'Dummy default', 'i18n' ),
		'description' => esc_html__( 'Some text as you like', 'i18n' ),
		'type' => 'kkcp_content',
	),
),

'kkcp-dummy-markdown' => array(
	'control' => array(
		'type' => 'kkcp_content',
		'markdown' => 'a lot of text and markdown.'
	),
),

```