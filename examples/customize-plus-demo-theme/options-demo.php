<?php defined( 'ABSPATH' ) or die;

/**
 * Customize options file
 *
 * @package      packageName
 * @since        0.0.1
 * @link         http://homepage.com
 * @author       name <email> (http://url.io)
 * @copyright    2015 | GPL
 * @license      GPL
 */

return array(
	array(
		'subject' => 'panel',
		'id' => 'layout',
		'title' => __( 'Example panel', 'textDomain' ),
		'description' => __( 'Layout generic options, globally change the look and feel', 'textDomain' ),
		// 'dashicon' => 309,
		'type' => 'pwpcp_panel',
		'sections' => array(
			array(
				'id' => 'layout-generic',
				'title' => __( 'Example section (empty)', 'textDomain' ),
				'description' => __( 'Just an empty section.', 'textDomain' ),
				'type' => 'pwpcp_section',
				'fields' => array()
			),
		)
	),
	array(
		'subject' => 'section',
		'id' => 'section',
		'title' => __( 'Color controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 309,
		'fields' => array(
			'color' => array(
				'setting' => array(
					'default' => 'transparent',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Color', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_color',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
			'default' => 'transparent',
			'transport' => 'postMessage',
		),
		'control' => array(
			'label' => __( 'Color', 'i18n' ),
			'type' => 'pwpcp_color',
	),
),
```",
					),
				),
			),
			'color-no-transparent' => array(
				'setting' => array(
					'default' => '#f00',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Disallow Transparent', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_color',
					'disallowTransparent' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '#f00',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Disallow Transparent', 'i18n' ),
		'type' => 'pwpcp_color',
		'disallowTransparent' => true,
	),
),
```",
					),
				),
			),
			'color-alpha' => array(
				'setting' => array(
					'default' => 'rgba(0,255,130,.5)',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Allow Alpha', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_color',
					'allowAlpha' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'rgba(0,255,130,.5)',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Allow Alpha', 'i18n' ),
		'type' => 'pwpcp_color',
		'allowAlpha' => true,
	),
),
```",
					),
				),
			),
			'color-palette1' => array(
				'setting' => array(
					'default' => '#444',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Palette only', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_color',
					'showPaletteOnly' => true,
					'palette' => array(
						array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '#444',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Palette only', 'i18n' ),
		'type' => 'pwpcp_color',
		'showPaletteOnly' => true,
		'palette' => array(
			array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
		),
	),
),
```",
					),
				),
			),
			'color-palette2' => array(
				'setting' => array(
					'default' => '#d9ead3',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Palette with picker', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_color',
					'palette' => array(
						array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '#d9ead3',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Palette with picker', 'i18n' ),
		'type' => 'pwpcp_color',
		'palette' => array(
			array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
		),
	),
),
```",
					),
				),
			),
			'color-palette3' => array(
				'setting' => array(
					'default' => '#fce5cd',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Palette and hidden picker', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_color',
					'showPaletteOnly' => true,
					'togglePaletteOnly' => true,
					'palette' => array(
						array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
						array( '#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f' ),
						array( '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc' ),
						array( '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '#fce5cd',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Palette and hidden picker', 'i18n' ),
		'type' => 'pwpcp_color',
		'showPaletteOnly' => true,
		'togglePaletteOnly' => true,
		'palette' => array(
			array( '#000', '#444', '#666', '#999', '#ccc', '#eee', '#f3f3f3', '#fff' ),
			array( '#f00', '#f90', '#ff0', '#0f0', '#0ff', '#00f', '#90f', '#f0f' ),
			array( '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc' ),
			array( '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd' ),
		),
	),
),
```",
					),
				),
			),
			'color-dynamic-active' => array(
				'setting' => array(
					'default' => '#f40030',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Dynamic Color [active]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_color_dynamic',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '#f40030',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Dynamic Color [active]', 'i18n' ),
		'type' => 'pwpcp_color_dynamic',
	),
),
```",
					),
				),
			),
			'color-dynamic-passive' => array(
				'setting' => array(
					'default' => 'fadeout(@color-dynamic-active,30)',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Dynamic Color 2 [passive]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_color_dynamic',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'fadeout(@color-dynamic-active,30)',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Dynamic Color 2 [passive]', 'i18n' ),
		'type' => 'pwpcp_color_dynamic',
	),
),
```",
					),
				),
			),
			'color-dynamic-hidetab-active' => array(
				'setting' => array(
					'default' => '#29BD57',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Dynamic Color (hide dynamic tab) [active]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_color_dynamic',
					'hideDynamic' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '#29BD57',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Dynamic Color (hide dynamic tab) [active]', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_color_dynamic',
		'hideDynamic' => true,
	),
),
```",
					),
				),
			),
			'color-dynamic-hidetab-passive' => array(
				'setting' => array(
					'default' => 'lighten(@color-dynamic-hidetab-active,30)',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Dynamic Color (hide dynamic tab) [passive]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_color_dynamic',
					'hideDynamic' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'lighten(@color-dynamic-hidetab-active,30)',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Dynamic Color (hide dynamic tab) [passive]', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_color_dynamic',
		'hideDynamic' => true,
	),
),
```",
					),
				),
			),
		)
	),
	array(
		'subject' => 'section',
		'id' => 'section-sizes',
		'title' => __( 'Size controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 211,
		'fields' => array(
			'slider' => array(
				'setting' => array(
					'default' => '14px',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Slider (default->px)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_slider',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '14px',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Slider (default->px)', 'i18n' ),
		'type' => 'pwpcp_slider',
	),
),
```",
					),
				),
			),
			'slider-em' => array(
				'setting' => array(
					'default' => '1.1em',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Slider (em)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_slider',
					'units' => array( 'em' ),
					'input_attrs' => array(
						'min' => 0,
						'max' => 3,
						'step' => 0.1,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '1.1em',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Slider (em)', 'i18n' ),
		'type' => 'pwpcp_slider',
		'units' => array( 'em' ),
		'input_attrs' => array(
			'min' => 0,
			'max' => 3,
			'step' => 0.1,
		),
	),
),
```",
					),
				),
			),
			'slider-px-percent' => array(
				'setting' => array(
					'default' => '15%',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Slider (px or percent)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_slider',
					'units' => array( 'px', '%' ),
					'input_attrs' => array(
						'min' => 0,
						'max' => 300,
						'step' => 1,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '15%',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Slider (px or percent)', 'i18n' ),
		'type' => 'pwpcp_slider',
		'units' => array( 'px', '%' ),
		'input_attrs' => array(
			'min' => 0,
			'max' => 300,
			'step' => 1,
		),
	),
),
```",
					),
				),
			),
			'size-dynamic-active' => array(
				'setting' => array(
					'default' => '14px',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Size Dynamic [active]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_size_dynamic',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '14px',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Size Dynamic [active]', 'i18n' ),
		'type' => 'pwpcp_size_dynamic',
	),
),
```",
					),
				),
			),
			'size-dynamic-passive' => array(
				'setting' => array(
					'default' => '@size-dynamic-active',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Size Dynamic [passive]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_size_dynamic',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '@size-dynamic-active',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Size Dynamic [passive]', 'i18n' ),
		'type' => 'pwpcp_size_dynamic',
	),
),
```",
					),
				),
			),
			'size-dynamic-hidetab-active' => array(
				'setting' => array(
					'default' => '40px',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Size Dynamic (hide dynamic tab) [active]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_size_dynamic',
					'hideDynamic' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '40px',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Size Dynamic (hide dynamic tab) [active]', 'i18n' ),
		'type' => 'pwpcp_size_dynamic',
		'hideDynamic' => true,
	),
),
```",
					),
				),
			),
			'size-dynamic-hidetab-passive' => array(
				'setting' => array(
					'default' => '@size-dynamic-hidetab-active',
					'transport' => 'recompileAndPost',
				),
				'control' => array(
					'label' => __( 'Size Dynamic (hide dynamic tab) [passive]', 'i18n' ),
					'description' => __( '**★ PREMIUM**', 'i18n' ),
					'type' => 'pwpcp_size_dynamic',
					'hideDynamic' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '@size-dynamic-hidetab-active',
		'transport' => 'recompileAndPost',
	),
	'control' => array(
		'label' => __( 'Size Dynamic (hide dynamic tab) [passive]', 'i18n' ),
		'type' => 'pwpcp_size_dynamic',
		'hideDynamic' => true,
	),
),
```",
					),
				),
			),
		)
	),
	array(
		'subject' => 'section',
		'id' => 'section-radio',
		'title' => __( 'Radio controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 159,
		'fields' => array(
			'radio' => array(
				'setting' => array(
					'default' => 'standard',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Radio', 'i18n' ),
					'type' => 'pwpcp_radio',
					'choices' => array(
						'standard' => array(
							'label' => __( 'Standard', 'i18n' ),
							'help' => 'popover',
							'help_title' => __( 'Standard value', 'i18n' ),
							'help_img' => 'view-skeleton--bootstrap.jpg',
						),
						'one' => array(
							'label' => __( 'Choice one', 'i18n' ),
						),
						'two' => array(
							'label' => __( 'Choice two', 'i18n' ),
						),
						'three' => array(
							'label' => __( 'Choice three', 'i18n' ),
						),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'standard',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Radio', 'i18n' ),
		'type' => 'pwpcp_radio',
		'choices' => array(
			'standard' => array(
				'label' => __( 'Standard', 'i18n' ),
				'help' => 'popover',
				'help_title' => __( 'Standard value', 'i18n' ),
				'help_img' => 'view-skeleton--bootstrap.jpg',
			),
			'one' => array(
				'label' => __( 'Choice one', 'i18n' ),
			),
			'two' => array(
				'label' => __( 'Choice two', 'i18n' ),
			),
			'three' => array(
				'label' => __( 'Choice three', 'i18n' ),
			),
		),
	),
),
```",
					),
				),
			),
			'buttonset' => array(
				'setting' => array(
					'default' => 'fluid',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Buttonset', 'i18n' ),
					'type' => 'pwpcp_buttonset',
					'guide' => array(
						'title' => __( 'Buttonset guide', 'i18n' ),
						'text' => __( 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe laboriosam sunt ab, error explicabo cupiditate alias blanditiis minima inventore tempora necessitatibus excepturi mollitia quam laborum unde maxime laudantium! Ratione, impedit!', 'i18n' ),
						'video' => 'uD7_Vt5q2q8',
					),
					'choices' => array(
						'boxed' => __( 'Boxed', 'i18n' ),
						'fluid' => __( 'Fluid', 'i18n' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'boxed',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Buttonset', 'i18n' ),
		'type' => 'pwpcp_buttonset',
		'choices' => array(
			'boxed' => __( 'Boxed', 'i18n' ),
			'fluid' => __( 'Fluid', 'i18n' ),
		),
	),
),
```",
					),
				),
			),
			'buttonset-three' => array(
				'setting' => array(
					'default' => 'may',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Buttonset three', 'i18n' ),
					'type' => 'pwpcp_buttonset',
					'guide' => array(
						'title' => __( 'Buttonset guide', 'i18n' ),
						'text' => __( 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe laboriosam sunt ab, error explicabo cupiditate alias blanditiis minima inventore tempora necessitatibus excepturi mollitia quam laborum unde maxime laudantium! Ratione, impedit!', 'i18n' ),
						'video' => 'uD7_Vt5q2q8',
					),
					'choices' => array(
						'may' => __( 'May', 'i18n' ),
						'ibanez' => __( 'Ibanez', 'i18n' ),
						'ward' => __( 'Ward', 'i18n' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'boxed',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Buttonset three', 'i18n' ),
		'type' => 'pwpcp_buttonset',
		'choices' => array(
			'may' => __( 'May', 'i18n' ),
			'ibanez' => __( 'Ibanez', 'i18n' ),
			'ward' => __( 'Ward', 'i18n' ),
		),
	),
),
```",
					),
				),
			),
			'buttonset-four' => array(
				'setting' => array(
					'default' => 'six',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Buttonset three', 'i18n' ),
					'type' => 'pwpcp_buttonset',
					'guide' => array(
						'title' => __( 'Buttonset guide', 'i18n' ),
						'text' => __( 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe laboriosam sunt ab, error explicabo cupiditate alias blanditiis minima inventore tempora necessitatibus excepturi mollitia quam laborum unde maxime laudantium! Ratione, impedit!', 'i18n' ),
						'video' => 'uD7_Vt5q2q8',
					),
					'choices' => array(
						'one' => __( 'One', 'i18n' ),
						'two' => __( 'Two', 'i18n' ),
						'five' => __( 'Five', 'i18n' ),
						'six' => __( 'Six', 'i18n' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'boxed',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Buttonset three', 'i18n' ),
		'type' => 'pwpcp_buttonset',
		'choices' => array(
			'one' => __( 'One', 'i18n' ),
			'two' => __( 'Two', 'i18n' ),
			'five' => __( 'Five', 'i18n' ),
			'six' => __( 'Six', 'i18n' ),
		),
	),
),
```",
					),
				),
			),
			'radio-image' => array(
				'setting' => array(
					'default' => 'less',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Radio image', 'i18n' ),
					'description' => __( 'Images already in the plugin, just put the image name', 'i18n' ),
					'type' => 'pwpcp_radio_image',
					'guide' => array(
						'docs' => 'doc-url/for-this-control/',
					),
					'choices' => array(
						'less' => array(
							'label' => __( 'Single column', 'i18n' ),
							'img' => 'sidebar-less',
						),
						'right' => array(
							'label' => __( 'Sidebar on the right', 'i18n' ),
							'img' => 'sidebar-right',
						),
						'left' => array(
							'label' => __( 'Sidebar on the left', 'i18n' ),
							'img' => 'sidebar-left',
						),
						'both' => array(
							'label' => __( 'Sidebar on both sides', 'i18n' ),
							'img' => 'sidebar-both',
						)
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'less',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Radio image', 'i18n' ),
		'type' => 'pwpcp_radio_image',
		'choices' => array(
			'less' => array(
				'label' => __( 'Single column', 'i18n' ),
				'img' => 'sidebar-less',
			),
			'right' => array(
				'label' => __( 'Sidebar on the right', 'i18n' ),
				'img' => 'sidebar-right',
			),
			'left' => array(
				'label' => __( 'Sidebar on the left', 'i18n' ),
				'img' => 'sidebar-left',
			),
			'both' => array(
				'label' => __( 'Sidebar on both sides', 'i18n' ),
				'img' => 'sidebar-both',
			)
		),
	),
),
```",
					),
				),
			),
			'radio-image-custom' => array(
				'setting' => array(
					'default' => 'firefox',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Radio image (custom)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_radio_image',
					'choices' => array(
						'chrome' => array(
							'label' => __( 'Chrome', 'i18n' ),
							'img_custom' => 'icon-chrome.png',
						),
						'firefox' => array(
							'label' => __( 'Firefox', 'i18n' ),
							'img_custom' => 'icon-firefox.png',
						),
						'ie' => array(
							'label' => __( 'IE', 'i18n' ),
							'img_custom' => 'icon-ie.png',
						),
						'opera' => array(
							'label' => __( 'Opera', 'i18n' ),
							'img_custom' => 'icon-opera.png',
						),
						'safari' => array(
							'label' => __( 'Safari', 'i18n' ),
							'img_custom' => 'icon-safari.png',
						),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'firefox',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Radio image (custom)', 'i18n' ),
		'type' => 'pwpcp_radio_image',
		'choices' => array(
			'chrome' => array(
				'label' => __( 'Chrome', 'i18n' ),
				'img_custom' => 'icon-chrome.png',
			),
			'firefox' => array(
				'label' => __( 'Firefox', 'i18n' ),
				'img_custom' => 'icon-firefox.png',
			),
			'ie' => array(
				'label' => __( 'IE', 'i18n' ),
				'img_custom' => 'icon-ie.png',
			),
			'opera' => array(
				'label' => __( 'Opera', 'i18n' ),
				'img_custom' => 'icon-opera.png',
			),
			'safari' => array(
				'label' => __( 'Safari', 'i18n' ),
				'img_custom' => 'icon-safari.png',
			),
		),
	),
),
```",
				  ),
				),
			),
		),
	),
	array(
		'subject' => 'section',
		'id' => 'section-checkbox',
		'title' => __( 'Checkbox controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 314,
		'fields' => array(
			'toggle' => array(
				'setting' => array(
					'default' => 1,
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Toggle', 'i18n' ),
					'description' => __( 'Either 0 or 1.', 'i18n' ),
					'type' => 'pwpcp_toggle',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 1,
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Toggle', 'i18n' ),
		'type' => 'pwpcp_toggle',
	),
),
```",
					),
				),
			),
			'multicheck' => array(
				'setting' => array(
					'default' => json_encode( array( 'grape', 'cherry' ) ),
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Multicheck', 'i18n' ),
					'description' => __( 'Select multiple options checking the boxes. Gives back an array ordered as defined by the developer.', 'i18n' ),
					'type' => 'pwpcp_multicheck',
					'choices' => array(
						'mango' => __( 'Mango', 'i18n' ),
						'grape' => __( 'Grape', 'i18n' ),
						'apple' => __( 'Apple', 'i18n' ),
						'cherry' => __( 'Cherry', 'i18n' ),
						'banana' => __( 'Banana', 'i18n' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => json_encode( array( 'grape', 'cherry' ) ),
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Multicheck', 'i18n' ),
		'type' => 'pwpcp_multicheck',
		'choices' => array(
			'mango' => __( 'Mango', 'i18n' ),
			'grape' => __( 'Grape', 'i18n' ),
			'apple' => __( 'Apple', 'i18n' ),
			'cherry' => __( 'Cherry', 'i18n' ),
			'banana' => __( 'Banana', 'i18n' ),
		),
	),
),
```",
					),
				),
			),
			'multicheck-sortable' => array(
				'setting' => array(
					'default' => json_encode( array( 'facebook', 'twitter', 'google' ) ),
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Multicheck sortable', 'i18n' ),
					'description' => __( 'Returns an array sorted as defined by the user containing only the checked values.', 'i18n' ),
					'type' => 'pwpcp_multicheck',
					'choices' => array(
						'facebook' => __( 'Facebook', 'i18n' ),
						'twitter' => __( 'Twitter', 'i18n' ),
						'google' => __( 'Google+', 'i18n' ),
						'tumblr' => __( 'Tumblr', 'i18n' ),
						'linkedin' => __( 'LinkedIn', 'i18n' ),
						'pinterest' => __( 'Pinterest', 'i18n' ),
						'reddit' => __( 'Reddit', 'i18n' ),
						'email' => __( 'Email', 'i18n' ),
					),
					'sortable' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => json_encode( array( 'facebook', 'twitter', 'google' ) ),
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Multicheck sortable', 'i18n' ),
		'type' => 'pwpcp_multicheck',
		'choices' => array(
			'facebook' => __( 'Facebook', 'i18n' ),
			'twitter' => __( 'Twitter', 'i18n' ),
			'google' => __( 'Google+', 'i18n' ),
			'tumblr' => __( 'Tumblr', 'i18n' ),
			'linkedin' => __( 'LinkedIn', 'i18n' ),
			'pinterest' => __( 'Pinterest', 'i18n' ),
			'reddit' => __( 'Reddit', 'i18n' ),
			'email' => __( 'Email', 'i18n' ),
		),
		'sortable' => true,
	),
),
```",
					),
				),
			),
		),
	),
	array(
		'subject' => 'section',
		'id' => 'section-texts',
		'title' => __( 'Text controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 215,
		'fields' => array(
			'text' => array(
				'setting' => array(
					'default' => 'Some plain text',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Text', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_text',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'Some plain text',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Text', 'i18n' ),
		'type' => 'pwpcp_text',
	),
),
```",
					),
				),
			),
			'text-max-length' => array(
				'setting' => array(
					'default' => 'tenchars !',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Text max length 10', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_text',
					'input_attrs' => array(
						'maxlength' => 10,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'tenchars !',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Text max length 10', 'i18n' ),
		'type' => 'pwpcp_text',
		'input_attrs' => array(
			'maxlength' => 10,
		),
	),
),
```",
					),
				),
			),
			'text-required' => array(
				'setting' => array(
					'default' => 'something',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Text required (no empty)', 'i18n' ),
					'description' => __( 'Empty value is not allowed, when the input is empty the control.setting keep the latest valid value.', 'i18n' ),
					'type' => 'pwpcp_text',
					'input_attrs' => array(
						'required' => true,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'something',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Text required (no empty)', 'i18n' ),
		'type' => 'pwpcp_text',
		'input_attrs' => array(
			'required' => true,
		),
	)
),
```",
					),
				),
			),
			'text-url' => array(
				'setting' => array(
					'default' => 'http://myurl.com',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Text URL', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_text',
					'input_attrs' => array(
						'type' => 'url',
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'http://myurl.com',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Text URL', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_text',
		'input_attrs' => array(
			'type' => 'url',
		),
	),
),
```",
					),
				),
			),
			'text-email' => array(
				'setting' => array(
					'default' => 'dev@pluswp.com',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Text Email', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_text',
					'input_attrs' => array(
						'type' => 'email',
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'dev@pluswp.com',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Text Email', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_text',
		'input_attrs' => array(
			'type' => 'email',
		),
	),
),
```",
					),
				),
			),
			'textarea' => array(
				'setting' => array(
					'default' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque. Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Textarea', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_textarea',
					'input_attrs' => array(
						'maxlength' => 300,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque. Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Textarea', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_textarea',
		'input_attrs' => array(
			'maxlength' => 300,
		),
	),
),
```",
					),
				),
			),
			'textarea-html' => array(
				'setting' => array(
					'default' => '<h3>Lorem ipsum dolor sit amet</h3> <p>Consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque. Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Textarea (allow HTML)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_textarea',
					'input_attrs' => array(
						'maxlength' => 300,
						'rows' => 8,
					),
					'allowHTML' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '<h3>Lorem ipsum dolor sit amet</h3> <p>Consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque. Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Textarea (allow HTML)', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_textarea',
		'input_attrs' => array(
			'maxlength' => 300,
			'rows' => 8,
		),
		'allowHTML' => true,
	),
),
```",
					),
				),
			),
			'textarea-wp_editor' => array(
				'setting' => array(
					'default' => '<h3>Lorem ipsum dolor sit amet</h3> <p>Consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque.</p>',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Textarea (wp_editor)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_textarea',
					'wp_editor' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '<h3>Lorem ipsum dolor sit amet</h3> <p>Consectetur adipisicing elit. Harum dolor natus ducimus, minima placeat, modi sint corrupti eaque.</p>',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Textarea (wp_editor)', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_textarea',
		'wp_editor' => true,
	),
),
```",
					),
				),
			),
			'textarea-wp_editor-options' => array(
				'setting' => array(
					'default' => '<h3>Consectetur adipisicing elit</h3> <p>Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Textarea (wp_editor with options)', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_textarea',
					'wp_editor' => array(
						'toolbar1' => 'bold,italic,underline,undo,redo',
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => '<h3>Consectetur adipisicing elit</h3> <p>Ratione delectus qui natus consequatur rem magnam, dolorem reprehenderit explicabo non nisi.</p>',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Textarea (wp_editor with options)', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_textarea',
		'wp_editor' => array(
			'toolbar1' => 'bold,italic,underline,undo,redo',
		),
	),
),
```",
					),
				),
			),
		),
	),
	array(
		'subject' => 'section',
		'id' => 'section-numbers',
		'title' => __( 'Number controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 204,
		'fields' => array(
			'number' => array(
				'setting' => array(
					'default' => 4,
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Number', 'i18n' ),
					'description' => __( 'Default number control', 'i18n' ),
					'type' => 'pwpcp_number',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 4,
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Number', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_number',
	),
),
```",
					),
				),
			),
			'number-min' => array(
				'setting' => array(
					'default' => 6,
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Number min / required', 'i18n' ),
					'description' => __( 'Number required (can not be empty) and with a minimum value.', 'i18n' ),
					'type' => 'pwpcp_number',
					'input_attrs' => array(
						'min' => 4,
						'required' => true,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 6,
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Number min / required', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_number',
		'input_attrs' => array(
			'min' => 4,
			'required' => true,
		),
	),
),
```",
					),
				),
			),
			'number-max' => array(
				'setting' => array(
					'default' => 3,
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Number max', 'i18n' ),
					'description' => __( 'Number with a  maximum value.', 'i18n' ),
					'type' => 'pwpcp_number',
					'input_attrs' => array(
						'max' => 7,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 3,
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Number max', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_number',
		'input_attrs' => array(
			'max' => 7,
		),
	),
),
```",
					),
				),
			),
			'number-step' => array(
				'setting' => array(
					'default' => 15,
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Number step', 'i18n' ),
					'description' => __( 'Number that increment or decrement by a defined step.', 'i18n' ),
					'type' => 'pwpcp_number',
					'input_attrs' => array(
						'step' => 5,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 15,
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Number step', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_number',
		'input_attrs' => array(
			'step' => 5,
		),
	),
),
```",
					),
				),
			),
		),
	),
	array(
		'subject' => 'section',
		'id' => 'section-select',
		'title' => __( 'Select controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 163,
		'fields' => array(
			'select' => array(
				'setting' => array(
					'default' => 'orange',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Select', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_select',
					'choices' => array(
						'lemon' => __( 'Lemon', 'i18n' ),
						'orange' => __( 'Orange', 'i18n' ),
						'pineapple' => __( 'Pineapple', 'i18n' ),
						'mango' => __( 'Mango', 'i18n' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'orange',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Select', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_select',
		'choices' => array(
			'lemon' => __( 'Lemon', 'i18n' ),
			'orange' => __( 'Orange', 'i18n' ),
			'pineapple' => __( 'Pineapple', 'i18n' ),
			'mango' => __( 'Mango', 'i18n' ),
		),
	),
),
```",
					),
				),
			),
			// @@note this would be the same as selectize with multiple choices
			// 'select-multiple' => array(
			// 	'setting' => array(
			// 		'default' => 'grape',
			// 		'transport' => 'postMessage',
			// 	),
			// 	'control' => array(
			// 		'label' => __( 'Select multiple', 'i18n' ),
			// 		'description' => __( '', 'i18n' ),
			// 		'type' => 'pwpcp_select',
			// 		'choices' => array(
			// 			'grape' => __( 'Grape', 'i18n' ),
			// 			'apple' => __( 'Apple', 'i18n' ),
			// 			'cherry' => __( 'Cherry', 'i18n' ),
			// 			'banana' => __( 'Banana', 'i18n' ),
			// 		),
			// 		'multiple' => true,
			// 	),
			// ),
			// \\
			'select-selectize' => array(
				'setting' => array(
					'default' => 'banana',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Selectize', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_select',
					'choices' => array(
						'lemon' => __( 'Lemon', 'i18n' ),
						'orange' => __( 'Orange', 'i18n' ),
						'pineapple' => __( 'Pineapple', 'i18n' ),
						'mango' => __( 'Mango', 'i18n' ),
						'grape' => __( 'Grape', 'i18n' ),
						'apple' => __( 'Apple', 'i18n' ),
						'cherry' => __( 'Cherry', 'i18n' ),
						'banana' => __( 'Banana', 'i18n' ),
					),
					'selectize' => true,
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'banana',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Selectize', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_select',
		'choices' => array(
			'lemon' => __( 'Lemon', 'i18n' ),
			'orange' => __( 'Orange', 'i18n' ),
			'pineapple' => __( 'Pineapple', 'i18n' ),
			'mango' => __( 'Mango', 'i18n' ),
			'grape' => __( 'Grape', 'i18n' ),
			'apple' => __( 'Apple', 'i18n' ),
			'cherry' => __( 'Cherry', 'i18n' ),
			'banana' => __( 'Banana', 'i18n' ),
		),
		'selectize' => true,
	),
),
```",
					),
				),
			),
			'select-selectize-options' => array(
				'setting' => array(
					'default' => 'cherry',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Selectize with options', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_select',
					'choices' => array(
						'lemon' => __( 'Lemon', 'i18n' ),
						'orange' => __( 'Orange', 'i18n' ),
						'pineapple' => __( 'Pineapple', 'i18n' ),
						'mango' => __( 'Mango', 'i18n' ),
						'grape' => __( 'Grape', 'i18n' ),
						'apple' => __( 'Apple', 'i18n' ),
						'cherry' => __( 'Cherry', 'i18n' ),
						'banana' => __( 'Banana', 'i18n' ),
					),
					'selectize' => array(
						'sortField' => 'text',
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'cherry',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Selectize with options', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_select',
		'choices' => array(
			'lemon' => __( 'Lemon', 'i18n' ),
			'orange' => __( 'Orange', 'i18n' ),
			'pineapple' => __( 'Pineapple', 'i18n' ),
			'mango' => __( 'Mango', 'i18n' ),
			'grape' => __( 'Grape', 'i18n' ),
			'apple' => __( 'Apple', 'i18n' ),
			'cherry' => __( 'Cherry', 'i18n' ),
			'banana' => __( 'Banana', 'i18n' ),
		),
		'selectize' => array(
			'sortField' => 'text',
		),
	),
),
```",
					),
				),
			),
			'select-selectize-more-items' => array(
				'setting' => array(
					'default' => json_encode( array( 'IT', 'UK' ) ),
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Selectize with multiple selection', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_select',
					'choices' => array(
						'IT' => __( 'Italy', 'i18n' ),
						'DE' => __( 'Germany', 'i18n' ),
						'FR' => __( 'France', 'i18n' ),
						'UK' => __( 'United Kingdom', 'i18n' ),
						'NL' => __( 'Netherlands', 'i18n' ),
						'SP' => __( 'Spain', 'i18n' ),
					),
					'selectize' => array(
						'maxItems' => 3,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => json_encode( array( 'IT', 'UK' ) ),
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Selectize with multiple selection', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_select',
		'choices' => array(
			'IT' => __( 'Italy', 'i18n' ),
			'DE' => __( 'Germany', 'i18n' ),
			'FR' => __( 'France', 'i18n' ),
			'UK' => __( 'United Kingdom', 'i18n' ),
			'NL' => __( 'Netherlands', 'i18n' ),
			'SP' => __( 'Spain', 'i18n' ),
		),
		'selectize' => array(
			'maxItems' => 3,
		),
	),
),
```",
					),
				),
			),
			'select-selectize-tags-plugins' => array(
				'setting' => array(
					'default' => json_encode( array( 'IT', 'NL', 'UK' ) ),
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Selectize with multiple selection and plugins', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_select',
					'choices' => array(
						'IT' => __( 'Italy', 'i18n' ),
						'DE' => __( 'Germany', 'i18n' ),
						'FR' => __( 'France', 'i18n' ),
						'UK' => __( 'United Kingdom', 'i18n' ),
						'NL' => __( 'Netherlands', 'i18n' ),
						'SP' => __( 'Spain', 'i18n' ),
					),
					'selectize' => array(
						'sortField' => 'text',
						'maxItems' => 4,
						'plugins' => array( 'restore_on_backspace', 'remove_button', 'drag_drop' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => json_encode( array( 'IT', 'NL', 'UK' ) ),
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Selectize with multiple selection and plugins', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_select',
		'choices' => array(
			'IT' => __( 'Italy', 'i18n' ),
			'DE' => __( 'Germany', 'i18n' ),
			'FR' => __( 'France', 'i18n' ),
			'UK' => __( 'United Kingdom', 'i18n' ),
			'NL' => __( 'Netherlands', 'i18n' ),
			'SP' => __( 'Spain', 'i18n' ),
		),
		'selectize' => array(
			'sortField' => 'text',
			'maxItems' => 4,
			'plugins' => array( 'restore_on_backspace', 'remove_button', 'drag_drop' ),
		),
	),
),
```",
					),
				),
			),
		),
	),
	array(
		'subject' => 'section',
		'id' => 'section-tags',
		'title' => __( 'Tags controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 109,
		'fields' => array(
			'tags' => array(
				'setting' => array(
					'default' => 'scissors,paper,rock',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Tags', 'i18n' ),
					'description' => __( 'Default tags control. User can insert new tags freely (HTML is escaped). It returns a comma separated string. Tags can be removed pressing the delete key.', 'i18n' ),
					'type' => 'pwpcp_tags',
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'scissors,paper,rock',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Tags', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_tags',
	),
),
```",
					),
				),
			),
			'tags-removable' => array(
				'setting' => array(
					'default' => 'one,two,three',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Tags removable', 'i18n' ),
					'description' => __( 'Tags can be removed clicking the x button close to each of them.', 'i18n' ),
					'type' => 'pwpcp_tags',
					'selectize' => array(
						'plugins' => array( 'restore_on_backspace', 'remove_button' )
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'one,two,three',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Tags removable', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_tags',
		'selectize' => array(
			'plugins' => array( 'restore_on_backspace', 'remove_button' )
		),
	),
),
```",
					),
				),
			),
			'tags-sortable-removable' => array(
				'setting' => array(
					'default' => 'milan,rome,venice',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Tags sortable and removable', 'i18n' ),
					'description' => __( '', 'i18n' ),
					'type' => 'pwpcp_tags',
					'selectize' => array(
						'plugins' => array( 'remove_button', 'drag_drop' )
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'milan,rome,venice',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Tags sortable and removable', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_tags',
		'selectize' => array(
			'plugins' => array( 'remove_button', 'drag_drop' )
		),
	),
),
```",
					),
				),
			),
			'tags-max-items' => array(
				'setting' => array(
					'default' => 'pine,oak',
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Tags max items', 'i18n' ),
					'description' => __( 'Specify a maximum nuber of tags allowed.', 'i18n' ),
					'type' => 'pwpcp_tags',
					'selectize' => array(
						'plugins' => array( 'restore_on_backspace', 'remove_button', 'drag_drop' ),
						'maxItems' => 2,
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => 'pine,oak',
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Tags max items', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_tags',
		'selectize' => array(
			'plugins' => array( 'restore_on_backspace', 'remove_button', 'drag_drop' ),
			'maxItems' => 2,
		),
	),
),
```",
					),
				),
			),
		),
	),
	array(
		'subject' => 'section',
		'id' => 'section-sortable',
		'title' => __( 'Sortable controls', 'textDomain' ),
		'type' => 'pwpcp_section',
		'dashicon' => 156,
		'fields' => array(
			'sortable' => array(
				'setting' => array(
					'default' => json_encode( array( 'lemon', 'cherry', 34, 'mango', 'grape' ) ),
					'transport' => 'postMessage',
				),
				'control' => array(
					'label' => __( 'Sortable', 'i18n' ),
					'description' => __( 'A sortable array of strings.', 'i18n' ),
					'type' => 'pwpcp_sortable',
					'choices' => array(
						'lemon' => __( 'Lemon', 'i18n' ),
						34 => '34',
						'mango' => __( 'Mango', 'i18n' ),
						'grape' => __( 'Grape', 'i18n' ),
						'cherry' => __( 'Cherry', 'i18n' ),
					),
					'guide' => array(
						'title' => __( 'See Code', 'i18n' ),
						'text' => "```php
'an-id' => array(
	'setting' => array(
		'default' => json_encode( array( 'lemon', 'cherry', 34, 'mango', 'grape' ) ),
		'transport' => 'postMessage',
	),
	'control' => array(
		'label' => __( 'Sortable', 'i18n' ),
		'description' => __( '', 'i18n' ),
		'type' => 'pwpcp_sortable',
		'choices' => array(
			'lemon' => __( 'Lemon', 'i18n' ),
			34 => '34',
			'mango' => __( 'Mango', 'i18n' ),
			'grape' => __( 'Grape', 'i18n' ),
			'cherry' => __( 'Cherry', 'i18n' ),
		),
	),
),
```",
					),
				),
			),
			// @@note this would be the same as selectize tags
			// 'sortable-editable' => array(
			// 	'setting' => array(
			// 		'default' => json_encode( array( 'lemon', 'cherry', 'pineapple', 'mango', 'grape' ) ),
			// 		'transport' => 'postMessage',
			// 	),
			// 	'control' => array(
			// 		'label' => __( 'Sortable', 'i18n' ),
			// 		'description' => __( '', 'i18n' ),
			// 		'type' => 'pwpcp_sortable',
			// 		'editable' => true,
			// 		'items' => array(
			// 			'placeholder' => __( 'Placeholder', 'i18n' ),
			// 		),
			// 		'maxItems' => 4,
			// 	),
			// ),
			// \\
		),
	),
);
