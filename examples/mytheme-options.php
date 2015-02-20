<?php defined( 'ABSPATH' ) or die;

return array(
	'layout' => array(
		'title' => __( 'Layout', 'pkgTextdomain' ),
		'description' => __( 'Layout generic options, globally change the look and feel', 'pkgTextdomain' ),
		'sections' => array(
			'layout--generic' => array(
				'title' => __( 'Generic', 'pkgTextdomain' ),
				'description' => __( 'Generic global layout options.', 'pkgTextdomain' ),
				'fields' => array(
					'view--skeleton' => array(
						'setting' => array(
							'default' => "'standard'",
							'transport' => 'recompileRefresh',
						),
						'control' => array(
							'label' => __( 'Skeleton Layout', 'pkgTextdomain' ),
							'type' => 'k6cp_radio',
							'choices' => array(
								"'standard'" => array(
									'label' => __( 'Standard', 'pkgTextdomain' ),
									'tip' => 'help',
									'tip_title' => __( 'Standard bootstrap layout', 'pkgTextdomain' ),
									'tip_img' => 'view-skeleton--bootstrap.jpg',
								),
								"'snapjs'" => array(
									'label' => __( 'Snap', 'pkgTextdomain' ),
								),
								"'pagepilingjs'" => array(
									'label' => __( 'Page piling', 'pkgTextdomain' ),
								),
								"'iscroll'" => array(
									'label' => __( 'iScroll', 'pkgTextdomain' ),
								),
							),
						)
					),
					'container' => array(
						'setting' => array(
							'default' => '',
							'transport' => 'refresh',
						),
						'control' => array(
							'label' => __( 'Layout container', 'pkgTextdomain' ),
							'type' => 'k6cp_buttonset',
							'choices' => array(
								'' => __( 'Boxed', 'pkgTextdomain' ),
								'-fluid' => __( 'Fluid', 'pkgTextdomain' ),
							),
						)
					),
				)
			),
			'layout--header' => array(
				'title' => __( 'Header', 'pkgTextdomain' ),
				'fields' => array(
					'view--menu-masthead' => array(
						'setting' => array(
							'default' => "'bootstrap'",
							'transport' => 'recompileRefresh',
						),
						'control' => array(
							'label' => __( 'Main Menu Navigation', 'pkgTextdomain' ),
							'type' => 'k6cp_radio',
							'choices' => array(
								"'bootstrap'" => __( 'Bootstrap', 'pkgTextdomain' ),
								"'nexus'" => __( 'Nexus', 'pkgTextdomain' ),
								"'sony'" => __( 'Sony', 'pkgTextdomain' ),
								"'spice'" => __( 'Spice', 'pkgTextdomain' ),
								"'DL'" => __( 'DL', 'pkgTextdomain' ),
							),
						)
					)
				)
			)
		)
	),
	'content' => array(
		'title' => __( 'Content', 'pkgTextdomain' ),
		'description' => __( 'Content customization', 'pkgTextdomain' ),
		'sections' => array(
			'content--footer' => array(
				'title' => __( 'Footer', 'pkgTextdomain' ),
				'fields' => array(
					'footer-text' => array(
						'setting' => array(
							'default' => 'Just the footer text',
							'transport' => 'postMessage',
							),
						'control' => array(
							'label' => __( 'Footer text', 'pkgTextdomain' ),
							'type' => 'k6cp_text',
						)
					)
				)
			),
			'content--social' => array(
				'title' => __( 'Social Media', 'pkgTextdomain' ),
				'fields' => array(
					'social-links' => array(
						'setting' => array(
							'default' => 1,
							'transport' => 'postMessage',
						),
						'control' => array(
							'label' => __( 'Social Links', 'pkgTextdomain' ),
							'description' => __( 'Enable social links', 'pkgTextdomain' ),
							'type' => 'k6cp_toggle',
						)
					),
					'social-share-networks' => array(
						'setting' => array(
							'default' => json_encode( array( 'facebook', 'twitter', 'google' ) ),
							'transport' => 'postMessage',
						),
						'control' => array(
							'label' => __( 'Social share', 'pkgTextdomain' ),
							'description' => __( 'Select the social networks you want to enable for social shares', 'pkgTextdomain' ),
							'type' => 'k6cp_multicheck',
							'choices' => array(
								'facebook' => __( 'Facebook', 'pkgTextdomain' ),
								'twitter' => __( 'Twitter', 'pkgTextdomain' ),
								'google' => __( 'Google+', 'pkgTextdomain' ),
								'tumblr' => __( 'Tumblr', 'pkgTextdomain' ),
								'linkedin' => __( 'LinkedIn', 'pkgTextdomain' ),
								'pinterest' => __( 'Pinterest', 'pkgTextdomain' ),
								'reddit' => __( 'Reddit', 'pkgTextdomain' ),
								'email' => __( 'Email', 'pkgTextdomain' ),
							),
						)
					)
				)
			)
		)
	)
);