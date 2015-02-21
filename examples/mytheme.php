<?php defined( 'ABSPATH' ) or die;

// TGM register plugins (specify Customize Plus (and in case Customize Plus Premium))
require_once dirname( __FILE__ ) . '/tgmpath.php';

if ( ! class_exists( 'MyTheme' ) ):

	class MyTheme {

	}

	// Instantiate
	new MyTheme;

endif; // End if class_exists check
