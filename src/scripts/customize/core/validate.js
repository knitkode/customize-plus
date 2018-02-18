import $ from 'jquery';
import _ from 'underscore';
import is_int from 'locutus/php/var/is_int';
import is_float from 'locutus/php/var/is_float';
import is_numeric from 'locutus/php/var/is_numeric';
import empty from 'locutus/php/var/empty';
import isURL from 'validator/lib/isURL';
import isEmail from 'validator/lib/isEmail';
import { api } from './globals';
import Helper from '../core/helper';

/**
 * Validate a required setting value
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function required( $validity={}, $value, $setting, $control ) {
  if ( !$control.params.optional ) {
    if ( Helper.isEmpty( $value ) ) {
      $validity = $control._addError( $validity, 'vRequired' );
    }
  }
  return $validity;
}

/**
 * Validate a single choice
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function singleChoice( $validity={}, $value, $setting, $control ) {
  const choices = $control._validChoices && $control._validChoices.length ? $control._validChoices : $control.params.choices;

  if ( choices.indexOf( $value ) === -1 ) {
    $validity = $control._addError( $validity, 'vNotAChoice', $value );
  }
  return $validity;
}

/**
 * Validate an array of choices
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param array                $value        The value to validate.
 * @param WP_Customize_Setting $setting      Setting instance.
 * @param WP_Customize_Control $control      Control instance.
 * @param boolean              $check_length Should match choices length? e.g.
 *                                           for sortable control where the all
 *                                           the defined choices should be
 *                                           present in the validated value
 * @return WP_Error
 */
export function multipleChoices( $validity={}, $value, $setting, $control, $check_length = false ) {
  const {params} = $control;
  const choices = $control._validChoices && $control._validChoices.length ? $control._validChoices : params.choices;

  if ( !_.isArray( $value ) ) {
    $validity = $control._addError( $validity, 'vNotArray' );
  } else {

    // maybe check that the length of the value array is correct
    if ( $check_length && choices.length !== $value.length ) {
      $validity = $control._addError( $validity, 'vNotExactLengthArray', choices.length );
    }

    // maybe check the minimum number of choices selectable
    if ( is_int( params.min ) && $value.length < params.min ) {
      $validity = $control._addError( $validity, 'vNotMinLengthArray', params.min );
    }

    // maybe check the maxmimum number of choices selectable
    if ( is_int( params.max ) && $value.length > params.max ) {
      $validity = $control._addError( $validity, 'vNotMaxLengthArray', params.max );
    }

    // now check that the selected values are allowed choices
    for (let i = 0; i < $value.length; i++) {
      if ( choices.indexOf( $value[i] ) === -1 ) {
        $validity = $control._addError( $validity, 'vNotAChoice', $value[i] );
      }
    }
  }

  return $validity;
}

/**
 * Validate one or more choices
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function oneOrMoreChoices( $validity={}, $value, $setting, $control ) {
  if ( _.isString( $value ) ) {
    return singleChoice( $validity, $value, $setting, $control );
  }
  return multipleChoices( $validity, $value, $setting, $control );
}

/**
 * Validate checkbox
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function checkbox( $validity={}, $value, $setting, $control ) {
  if ( $value != 1 && $value != 0 ) {
    $validity = $control._addError( $validity, 'vCheckbox' );
  }
  return $validity;
}

/**
 * Validate tags
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function tags( $validity={}, $value, $setting, $control ) {
  const {params} = $control;

  if ( !_.isString( $value ) ) {
    $validity = $control._addError( $validity, 'vTagsType' );
  }
  if (!_.isArray($value)) {
    $value = $value.split(',');
  }

  // maybe check the minimum number of choices selectable
  if ( is_int( params.min ) && $value.length < params.min ) {
    $validity = $control._addError( $validity, 'vTagsMin', params.min );
  }
  // maybe check the maxmimum number of choices selectable
  if ( is_int( params.max ) && $value.length > params.max ) {
    $validity = $control._addError( $validity, 'vTagsMax', params.max );
  }

  return $validity;
}

/**
 * Validate text
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function text( $validity={}, $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const $input_type = $attrs.type || 'text';

  // type
  if ( ! _.isString( $value ) ) {
    $validity = $control._addError( $validity, 'vTextType' );
  }
  // url
  // make the `isURL` function behaving like php's `filter_var( $value, FILTER_VALIDATE_URL )`
  if ( $input_type === 'url' && !isURL( $value, { require_tld: false, allow_trailing_dot: true } ) ) {
    $validity = $control._addError( $validity, 'vInvalidUrl' );
  }
  // email
  else if ( $input_type === 'email' && !isEmail( $value ) ) {
    $validity = $control._addError( $validity, 'vInvalidEmail' );
  }
  // max length
  if ( is_int( $attrs['maxlength'] ) && $value.length > $attrs['maxlength'] ) {
    $validity = $control._addError( $validity, 'vTextTooLong', $attrs['maxlength'] );
  }

  // html must be escaped
  if ( $control.params.html === 'escape' ) {
    // if ( Helper.hasHTML( $value ) ) {
    //   $validity = $control._addWarning( $validity, 'vTextEscaped' ); // @@todo \\
    // }
  }
  // html is dangerously completely allowed
  else if ( $control.params.html === 'dangerous' ) {
    // $validity = $control._addWarning( $validity, 'vTextDangerousHtml' ); // @@todo \\
  }
  // html is not allowed at all
  else if ( ! $control.params.html ) {
    if ( Helper.hasHTML( $value ) ) {
      $validity = $control._addError( $validity, 'vTextHtml' );
    }
  }
  // @@todo find some smart way to javascriptify the following html validation
  // html is a valid argument for wp_kses_allowed_html
  // else if ( $control->html ) {
  //   if ( $value != wp_kses( $value, wp_kses_allowed_html( $control->html ) ) ) {
  //     $validity = $control->add_error( $validity, 'vTextInvalidHtml' );
  //   }
  // }
  // or show a warning/info to indicate that the live preview might differ from
  // what is actually stored in the database
  // $validity = $control._addWarning( $validity, '' );
  // \\

  return $validity;
}

/**
 * Validate number
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function number( $validity={}, $value, $setting, $control ) {
  const $attrs = $control.params.attrs;
  const allowFloat = $control.params.allowFloat;

  // coerce to number
  $value = Number($value);

  // no number
  if ( ! is_numeric( $value ) ) {
    $validity = $control._addError( $validity, 'vNotAnumber' );
    return $validity;
  }
  // unallowed float
  if ( is_float( $value ) && !allowFloat ) {
    $validity = $control._addError( $validity, 'vNoFloat' );
  }
  // must be an int but it is not
  else if ( ! is_int( $value ) && !allowFloat ) {
    $validity = $control._addError( $validity, 'vNotAnInteger' );
  }

  if ( $attrs ) {
    // if doesn't respect the step given
    if ( is_numeric( $attrs['step'] ) && Helper.modulus($value, $attrs['step']) !== 0 ) {
      $validity = $control._addError( $validity, 'vNumberStep', $attrs['step'] );
    }
    // if it's lower than the minimum
    if ( is_numeric( $attrs['min'] ) && $value < $attrs['min'] ) {
      $validity = $control._addError( $validity, 'vNumberLow', $attrs['min'] );
    }
    // if it's higher than the maxmimum
    if ( is_numeric( $attrs['max'] ) && $value > $attrs['max'] ) {
      $validity = $control._addError( $validity, 'vNumberHigh', $attrs['max'] );
    }
  }

  return $validity;
}

/**
 * Validate css unit
 *
 * @since 1.0.0
 *
 * @param WP_Error                $validity
 * @param mixed    $unit          The unit to validate.
 * @param mixed    $allowed_units The allowed units
 * @return WP_Error
 */
export function sizeUnit( $validity, $unit, $allowed_units ) {
  // if it needs a unit and it is missing
  if ( ! empty( $allowed_units ) && ! $unit ) {
    $validity = $control._addError( $validity, 'vSliderMissingUnit' );
  }
  // if the unit specified is not in the allowed ones
  else if ( ! empty( $allowed_units ) && $unit && $allowed_units.indexOf( $unit ) === -1 ) {
    $validity = $control._addError( $validity, 'vSliderInvalidUnit' );
  }
  // if a unit is specified but none is allowed
  else if ( empty( $allowed_units ) && $unit ) {
    $validity = $control._addError( $validity, 'vSliderNoUnit' );
  }

  return $validity;
}

/**
 * Validate slider
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function slider( $validity={}, $value, $setting, $control ) {
  let $number = Helper.extractNumber( $value, $control.params.allowFloat );
  let $unit = Helper.extractSizeUnit( $value, $control.params.units );

  $validity = number( $validity, $number, $setting, $control );
  $validity = sizeUnit( $validity, $unit, $control.params.units );

  return $validity;
}

/**
 * Validate color
 *
 * @since 1.0.0
 *
 * @param WP_Error             $validity
 * @param mixed                $value    The value to validate.
 * @param WP_Customize_Setting $setting  Setting instance.
 * @param WP_Customize_Control $control  Control instance.
 * @return WP_Error
 */
export function color( $validity={}, $value, $setting, $control ) {
  const params = $control.params;
  $value = $value.replace(/\s/g, '');

  if (params.showPaletteOnly &&
    !params.togglePaletteOnly &&
    _.isArray(params.palette)
  ) {
    let allColorsAllowed = _.flatten(params.palette, true);
    allColorsAllowed = _.map(allColorsAllowed, (color) => {
      return $control.softenize(color);
    });
    if (allColorsAllowed.indexOf($control.softenize($value)) === -1) {
      $validity = $control._addError( $validity, 'vNotInPalette' );
    }
  }

  if (params.disallowTransparent && $value === 'transparent') {
    $validity = $control._addError( $validity, 'vNoTranpsarent' );
  }

  if (!params.allowAlpha && Helper.isRgba($value)) {
    $validity = $control._addError( $validity, 'vNoRGBA' );
  }

  if (!Helper.isHex($value) &&
      !Helper.isRgb($value) &&
      !Helper.isRgba($value) &&
      $value !== 'transparent'
    ) {
    $validity = $control._addError( $validity, 'vColorInvalid' );
  }

  return $validity;
}

/**
 * Exports the `Validate` object
 */
export default {
  required,
  singleChoice,
  multipleChoices,
  oneOrMoreChoices,
  checkbox,
  tags,
  text,
  number,
  sizeUnit,
  slider,
  color,
};
