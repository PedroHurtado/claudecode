/* @ds-bundle: {"format":3,"namespace":"FudieDesignSystem_924596","components":[{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Spinner","sourcePath":"components/feedback/Spinner.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Avatar.jsx":"d87e721d889a","components/display/Card.jsx":"f66f88ed98bd","components/feedback/Badge.jsx":"a7df666c0c97","components/feedback/Spinner.jsx":"72460a867673","components/feedback/Toast.jsx":"2c4fabb6d31b","components/forms/Button.jsx":"6297f82cd882","components/forms/Checkbox.jsx":"c13474aa3c35","components/forms/IconButton.jsx":"1a77d499a459","components/forms/Input.jsx":"f0eb9cf6251e","components/forms/Switch.jsx":"a63405312595","components/navigation/Tabs.jsx":"1189f24bedf4","ui_kits/fudie-app/screens.jsx":"eaec1825413d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FudieDesignSystem_924596 = window.FudieDesignSystem_924596 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72
};
function initials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
}

/**
 * User/restaurant avatar. Falls back to initials on a tinted surface.
 */
function Avatar({
  src,
  name = '',
  size = 'md',
  square = false,
  style,
  ...rest
}) {
  const dim = SIZES[size] || SIZES.md;
  const radius = square ? 'var(--radius-lg)' : 'var(--radius-full)';
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      flex: '0 0 auto',
      borderRadius: radius,
      overflow: 'hidden',
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary-dark)',
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--font-bold)',
      fontSize: Math.max(11, dim * 0.4),
      userSelect: 'none',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Surface container with token-driven elevation and radius.
 */
function Card({
  padding = 'md',
  radius = 'lg',
  interactive = false,
  elevation = 'card',
  children,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const padMap = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--card-padding)',
    lg: 'var(--space-8)'
  };
  const radMap = {
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    '2xl': 'var(--radius-2xl)'
  };
  const elevMap = {
    none: 'none',
    card: 'var(--shadow-card)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--color-surface)',
      border: 'var(--border-default)',
      borderRadius: radMap[radius] || radMap.lg,
      padding: padMap[padding] ?? padMap.md,
      boxShadow: interactive && hover ? 'var(--shadow-lg)' : elevMap[elevation] || elevMap.card,
      transform: interactive && hover ? 'translateY(-2px)' : 'none',
      transition: 'var(--transition-default), transform var(--duration-normal) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-text)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    bg: 'var(--gray-100)',
    fg: 'var(--gray-700)'
  },
  primary: {
    bg: 'var(--color-primary-subtle)',
    fg: 'var(--color-primary-dark)'
  },
  success: {
    bg: 'var(--color-success-subtle)',
    fg: 'var(--color-success-text)'
  },
  warning: {
    bg: 'var(--color-warning-subtle)',
    fg: 'var(--color-warning-text)'
  },
  error: {
    bg: 'var(--color-error-subtle)',
    fg: 'var(--color-error-text)'
  },
  info: {
    bg: 'var(--color-info-subtle)',
    fg: 'var(--color-info-text)'
  },
  service: {
    bg: 'var(--color-service-subtle)',
    fg: 'var(--color-service-text)'
  }
};
const SOLID = {
  neutral: {
    bg: 'var(--gray-700)',
    fg: 'var(--color-white)'
  },
  primary: {
    bg: 'var(--color-primary)',
    fg: 'var(--color-white)'
  },
  success: {
    bg: 'var(--color-success)',
    fg: 'var(--color-white)'
  },
  warning: {
    bg: 'var(--color-warning)',
    fg: 'var(--color-warning-on)'
  },
  error: {
    bg: 'var(--color-error)',
    fg: 'var(--color-white)'
  },
  info: {
    bg: 'var(--color-info)',
    fg: 'var(--color-white)'
  },
  service: {
    bg: 'var(--color-service)',
    fg: 'var(--color-white)'
  }
};

/**
 * Small status/label pill. Tinted by default; `solid` for high emphasis.
 */
function Badge({
  tone = 'neutral',
  solid = false,
  dot = false,
  children,
  style,
  ...rest
}) {
  const palette = (solid ? SOLID : TONES)[tone] || (solid ? SOLID.neutral : TONES.neutral);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: '0.125rem var(--space-3)',
      minHeight: '1.5rem',
      background: palette.bg,
      color: palette.fg,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--font-semibold)',
      lineHeight: 'var(--leading-none)',
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 'var(--radius-full)',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Spinner.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Indeterminate loading spinner using the brand color.
 */
function Spinner({
  size = 'md',
  tone = 'primary',
  style,
  ...rest
}) {
  const dimMap = {
    sm: 16,
    md: 24,
    lg: 36
  };
  const dim = dimMap[size] || dimMap.md;
  const toneMap = {
    primary: 'var(--color-primary)',
    neutral: 'var(--gray-400)',
    white: 'var(--color-white)'
  };
  const color = toneMap[tone] || toneMap.primary;
  const stroke = Math.max(2, dim / 9);
  return /*#__PURE__*/React.createElement("span", _extends({
    role: "status",
    "aria-label": "Cargando",
    style: {
      display: 'inline-flex',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("svg", {
    width: dim,
    height: dim,
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      animation: 'fudie-spin 0.7s linear infinite'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    stroke: color,
    strokeOpacity: "0.2",
    strokeWidth: stroke
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12a9 9 0 0 0-9-9",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("style", null, `@keyframes fudie-spin { to { transform: rotate(360deg); } }`));
}
Object.assign(__ds_scope, { Spinner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Spinner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: 'var(--gray-700)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  error: 'var(--color-error)',
  info: 'var(--color-info)',
  primary: 'var(--color-primary)'
};

/**
 * Transient notification card. Render inside a fixed-position stack.
 */
function Toast({
  tone = 'neutral',
  title,
  message,
  icon = null,
  onClose,
  style,
  ...rest
}) {
  const accent = TONES[tone] || TONES.neutral;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--space-3)',
      width: 'min(380px, 90vw)',
      padding: 'var(--space-4)',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-toast)',
      borderLeft: `var(--border-thick) solid ${accent}`,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: accent,
      marginTop: 2
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-semibold)',
      color: 'var(--color-text)'
    }
  }, title), message && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-secondary)',
      marginTop: title ? 2 : 0
    }
  }, message)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Cerrar",
    onClick: onClose,
    style: {
      display: 'flex',
      color: 'var(--color-text-secondary)',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4l8 8M12 4l-8 8",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }))));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: {
    height: 'var(--control-height-sm)',
    padding: '0 var(--space-4)',
    fontSize: 'var(--text-sm)',
    gap: 'var(--space-2)'
  },
  md: {
    height: 'var(--control-height-md)',
    padding: '0 var(--space-5)',
    fontSize: 'var(--text-sm)',
    gap: 'var(--space-2)'
  },
  lg: {
    height: 'var(--control-height-lg)',
    padding: '0 var(--space-6)',
    fontSize: 'var(--text-base)',
    gap: 'var(--space-3)'
  }
};
const VARIANTS = {
  primary: {
    base: {
      background: 'var(--color-primary)',
      color: 'var(--color-text-on-primary)',
      border: '1px solid transparent'
    },
    hover: {
      background: 'var(--color-primary-dark)'
    }
  },
  secondary: {
    base: {
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      border: 'var(--border-strong)'
    },
    hover: {
      background: 'var(--gray-50)',
      borderColor: 'var(--gray-400)'
    }
  },
  ghost: {
    base: {
      background: 'transparent',
      color: 'var(--color-text-secondary)',
      border: '1px solid transparent'
    },
    hover: {
      background: 'var(--gray-100)',
      color: 'var(--color-text)'
    }
  },
  danger: {
    base: {
      background: 'var(--color-error)',
      color: 'var(--color-white)',
      border: '1px solid transparent'
    },
    hover: {
      background: 'var(--color-error-dark)'
    }
  },
  subtle: {
    base: {
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary-dark)',
      border: '1px solid transparent'
    },
    hover: {
      background: '#FFE2E4'
    }
  }
};

/**
 * Fudie primary action button. Pill-friendly rounded shape, brand-red default.
 */
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leadingIcon = null,
  trailingIcon = null,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    fontWeight: 'var(--font-semibold)',
    lineHeight: 'var(--leading-none)',
    letterSpacing: 'var(--tracking-normal)',
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'var(--transition-default)',
    transform: active && !disabled ? 'scale(0.97)' : 'scale(1)',
    whiteSpace: 'nowrap',
    ...v.base,
    ...(hover && !disabled ? v.hover : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: composed,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), leadingIcon, children, trailingIcon);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CheckGlyph = () => /*#__PURE__*/React.createElement("svg", {
  width: "12",
  height: "12",
  viewBox: "0 0 12 12",
  fill: "none",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M2.5 6.2L4.8 8.5L9.5 3.5",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}));

/**
 * Checkbox with optional label. Controlled via `checked` + `onChange`.
 */
function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  id,
  style,
  ...rest
}) {
  const reactId = React.useId();
  const fieldId = id || reactId;
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: fieldId,
    type: "button",
    role: "checkbox",
    "aria-checked": checked,
    disabled: disabled,
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-sm)',
      border: checked ? '1px solid var(--color-primary)' : 'var(--border-strong)',
      background: checked ? 'var(--color-primary)' : 'var(--color-surface)',
      color: 'var(--color-white)',
      transition: 'var(--transition-default)',
      padding: 0
    }
  }, rest), checked && /*#__PURE__*/React.createElement(CheckGlyph, null)), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
const SIZES = {
  sm: 'var(--control-height-sm)',
  md: 'var(--control-height-md)',
  lg: 'var(--control-height-lg)'
};
const VARIANTS = {
  ghost: {
    base: {
      background: 'transparent',
      color: 'var(--color-text-secondary)'
    },
    hover: {
      background: 'var(--gray-100)',
      color: 'var(--color-text)'
    }
  },
  surface: {
    base: {
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      border: 'var(--border-default)'
    },
    hover: {
      background: 'var(--gray-50)'
    }
  },
  primary: {
    base: {
      background: 'var(--color-primary)',
      color: 'var(--color-white)'
    },
    hover: {
      background: 'var(--color-primary-dark)'
    }
  }
};

/**
 * Square/circular icon-only button. Always pass an aria-label.
 */
function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  round = false,
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const v = VARIANTS[variant] || VARIANTS.ghost;
  const dim = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      flex: '0 0 auto',
      borderRadius: round ? 'var(--radius-full)' : 'var(--radius-md)',
      border: '1px solid transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'var(--transition-default)',
      ...v.base,
      ...(hover && !disabled ? v.hover : null),
      ...style
    }
  }, rest), icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Text field with optional label, hint, error and leading/trailing adornments.
 */
function Input({
  label,
  hint,
  error,
  type = 'text',
  size = 'md',
  leadingIcon = null,
  trailingIcon = null,
  disabled = false,
  id,
  value,
  defaultValue,
  placeholder,
  onChange,
  style,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const reactId = React.useId();
  const fieldId = id || reactId;
  const invalid = Boolean(error);
  const height = size === 'lg' ? 'var(--control-height-lg)' : size === 'sm' ? 'var(--control-height-sm)' : 'var(--control-height-md)';
  const borderColor = invalid ? 'var(--color-error)' : focus ? 'var(--color-primary)' : 'var(--color-border-strong)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      color: 'var(--color-text)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      height,
      padding: '0 var(--input-padding-x)',
      background: disabled ? 'var(--gray-100)' : 'var(--color-surface)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? invalid ? 'var(--shadow-focus-error)' : 'var(--shadow-focus-primary)' : 'none',
      transition: 'var(--transition-default)',
      opacity: disabled ? 0.6 : 1
    }
  }, leadingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: 'var(--color-text-secondary)'
    }
  }, leadingIcon), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    type: type,
    value: value,
    defaultValue: defaultValue,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    "aria-invalid": invalid,
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--color-text)',
      fontSize: 'var(--text-sm)'
    }
  }, rest)), trailingIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: 'var(--color-text-secondary)'
    }
  }, trailingIcon)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      minHeight: 'var(--field-message-min-height)',
      fontSize: 'var(--text-xs)',
      color: invalid ? 'var(--color-error-text)' : 'var(--color-text-secondary)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * On/off toggle. Controlled via `checked` + `onChange`.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  label,
  id,
  style,
  ...rest
}) {
  const reactId = React.useId();
  const fieldId = id || reactId;
  const dims = size === 'sm' ? {
    w: 36,
    h: 20,
    knob: 14
  } : {
    w: 44,
    h: 24,
    knob: 18
  };
  const pad = (dims.h - dims.knob) / 2;
  const toggle = () => {
    if (!disabled && onChange) onChange(!checked);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", _extends({
    id: fieldId,
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: toggle,
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--color-primary)' : 'var(--gray-300)',
      transition: 'background-color var(--duration-normal) var(--ease-default)',
      padding: 0
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: pad,
      left: checked ? dims.w - dims.knob - pad : pad,
      width: dims.knob,
      height: dims.knob,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-white)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--duration-normal) var(--ease-spring)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Underline tab bar. Controlled via `value` + `onChange`.
 * items: [{ value, label, badge? }]
 */
function Tabs({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      borderBottom: 'var(--border-default)',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, rest), items.map(it => {
    const active = it.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.value,
      type: "button",
      role: "tab",
      "aria-selected": active,
      onClick: () => onChange && onChange(it.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) 0',
        marginBottom: -1,
        borderBottom: `var(--border-medium) solid ${active ? 'var(--color-primary)' : 'transparent'}`,
        color: active ? 'var(--color-text)' : 'var(--color-text-secondary)',
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 'var(--font-semibold)' : 'var(--font-medium)',
        transition: 'var(--transition-colors)',
        whiteSpace: 'nowrap'
      }
    }, it.label, it.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        background: active ? 'var(--color-primary-subtle)' : 'var(--gray-100)',
        borderRadius: 'var(--radius-full)',
        padding: '0 var(--space-2)',
        minWidth: 18,
        textAlign: 'center'
      }
    }, it.badge));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/fudie-app/screens.jsx
try { (() => {
/* Fudie app · UI kit screens
   Illustrative composition of the design system (no product screens were
   provided). Exports screen components to window for index.html to mount. */

const {
  useState
} = React;
const DS = window.FudieDesignSystem_924596;
const {
  Button,
  IconButton,
  Input,
  Badge,
  Avatar,
  Card,
  Tabs,
  Switch
} = DS;

/* ── Icons (stroke, 24px grid — matches Lucide weight) ── */
const Ic = {
  search: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 20,
    height: p?.s || 20,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7",
    stroke: "currentColor",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3-3",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })),
  back: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 22,
    height: p?.s || 22,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 19l-7-7 7-7",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  heart: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 20,
    height: p?.s || 20,
    viewBox: "0 0 24 24",
    fill: p?.fill || "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5C19 15.5 12 20 12 20z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinejoin: "round"
  })),
  star: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 14,
    height: p?.s || 14,
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l2.6 5.6 6 .7-4.4 4 1.2 6L12 16.9 6.6 19.3l1.2-6-4.4-4 6-.7z"
  })),
  clock: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 14,
    height: p?.s || 14,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9",
    stroke: "currentColor",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })),
  plus: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  })),
  minus: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  })),
  home: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 22,
    height: p?.s || 22,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinejoin: "round"
  })),
  bag: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 22,
    height: p?.s || 22,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8h12l-1 12H7L6 8z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8a3 3 0 0 1 6 0",
    stroke: "currentColor",
    strokeWidth: "2"
  })),
  receipt: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 22,
    height: p?.s || 22,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 3h12v18l-3-2-3 2-3-2-3 2z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 8h6M9 12h6",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })),
  user: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 22,
    height: p?.s || 22,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "4",
    stroke: "currentColor",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 20a7 7 0 0 1 14 0",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  })),
  pin: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 16,
    height: p?.s || 16,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "10",
    r: "2.5",
    stroke: "currentColor",
    strokeWidth: "2"
  })),
  check: p => /*#__PURE__*/React.createElement("svg", {
    width: p?.s || 18,
    height: p?.s || 18,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 13l4 4L19 7",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))
};

/* ── Food placeholder (no real imagery provided) ── */
const FOOD_TINTS = {
  tacos: ['#FFE2C2', '#F8B26A'],
  pizza: ['#FFD9D6', '#F2786E'],
  sushi: ['#D6EFE4', '#5BBF97'],
  burger: ['#FBE6BE', '#E0A33C'],
  bowl: ['#E7E0FB', '#9B7BE0'],
  coffee: ['#EADFD3', '#B08968']
};
function Photo({
  kind = 'tacos',
  label,
  h = 120,
  r = 'var(--radius-lg)'
}) {
  const t = FOOD_TINTS[kind] || FOOD_TINTS.tacos;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      borderRadius: r,
      background: `linear-gradient(135deg, ${t[0]}, ${t[1]})`,
      position: 'relative',
      overflow: 'hidden',
      flex: '0 0 auto'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: 8,
      left: 10,
      fontSize: 11,
      fontWeight: 700,
      color: 'rgba(0,0,0,.45)',
      letterSpacing: '.04em',
      textTransform: 'uppercase'
    }
  }, label));
}

/* ── Data ── */
const RESTAURANTS = [{
  id: 'r1',
  name: 'Tacos El Güero',
  cat: 'Mexicana',
  kind: 'tacos',
  rating: 4.7,
  time: '20–30',
  fee: 'Envío gratis',
  dist: '1.2 km',
  promo: '-20%',
  open: true
}, {
  id: 'r2',
  name: 'Nonna Pizza',
  cat: 'Italiana',
  kind: 'pizza',
  rating: 4.5,
  time: '25–35',
  fee: '$25',
  dist: '2.0 km',
  promo: null,
  open: true
}, {
  id: 'r3',
  name: 'Sakura Sushi',
  cat: 'Japonesa',
  kind: 'sushi',
  rating: 4.8,
  time: '30–40',
  fee: '$35',
  dist: '3.4 km',
  promo: '2x1',
  open: true
}, {
  id: 'r4',
  name: 'Green Bowl',
  cat: 'Saludable',
  kind: 'bowl',
  rating: 4.6,
  time: '15–25',
  fee: 'Envío gratis',
  dist: '0.8 km',
  promo: null,
  open: false
}];
const MENU = {
  r1: [{
    id: 'm1',
    name: 'Tacos al pastor (4)',
    desc: 'Cebolla, cilantro, piña',
    price: 89,
    kind: 'tacos'
  }, {
    id: 'm2',
    name: 'Quesabirria (3)',
    desc: 'Con consomé para dipear',
    price: 119,
    kind: 'tacos'
  }, {
    id: 'm3',
    name: 'Agua de horchata',
    desc: '500 ml',
    price: 35,
    kind: 'coffee'
  }]
};

/* ── Shared chrome ── */
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-5)',
      fontSize: 13,
      fontWeight: 700,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 5,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "11",
    viewBox: "0 0 17 11",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "6",
    width: "3",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "3.5",
    width: "3",
    height: "7.5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "1",
    width: "3",
    height: "10",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13.5",
    y: "0",
    width: "3",
    height: "11",
    rx: "1",
    opacity: ".35"
  })), /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "11",
    viewBox: "0 0 24 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "20",
    height: "10",
    rx: "2.5",
    stroke: "currentColor",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "2.5",
    width: "15",
    height: "7",
    rx: "1.2",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "22",
    y: "4",
    width: "1.5",
    height: "4",
    rx: ".75",
    fill: "currentColor"
  }))));
}
function MetaRow({
  r
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-secondary)',
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      color: 'var(--color-warning-dark)'
    }
  }, /*#__PURE__*/React.createElement(Ic.star, null), " ", r.rating), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement(Ic.clock, null), " ", r.time, " min"), /*#__PURE__*/React.createElement("span", null, r.dist));
}

/* ── Screen: Home ── */
function HomeScreen({
  onOpen,
  fav,
  toggleFav
}) {
  const [tab, setTab] = useState('cerca');
  const cats = ['Todo', 'Tacos', 'Pizza', 'Sushi', 'Saludable', 'Postres'];
  const [cat, setCat] = useState('Todo');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 var(--space-5) var(--space-3)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-secondary)',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(Ic.pin, null), " Entregar en"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 'var(--text-lg)'
    }
  }, "Av. Reforma 222 \u25BE")), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mar\xEDa L\xF3pez",
    size: "md"
  })), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Tacos, pizza, sushi\u2026",
    leadingIcon: /*#__PURE__*/React.createElement(Ic.search, null),
    "aria-label": "Buscar"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      overflowX: 'auto',
      padding: '0 var(--space-5) var(--space-3)',
      flex: '0 0 auto'
    }
  }, cats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c,
    onClick: () => setCat(c),
    style: {
      padding: '6px var(--space-4)',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      whiteSpace: 'nowrap',
      flex: '0 0 auto',
      background: cat === c ? 'var(--color-primary)' : 'var(--color-surface)',
      color: cat === c ? '#fff' : 'var(--color-text)',
      border: cat === c ? '1px solid transparent' : 'var(--border-default)'
    }
  }, c))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-2) 0'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'cerca',
      label: 'Cerca de ti'
    }, {
      value: 'pop',
      label: 'Populares',
      badge: 24
    }, {
      value: 'ofertas',
      label: 'Ofertas',
      badge: 8
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-4)'
    }
  }, RESTAURANTS.map(r => /*#__PURE__*/React.createElement(Card, {
    key: r.id,
    padding: "none",
    interactive: true,
    onClick: () => r.open && onOpen(r.id),
    style: {
      overflow: 'hidden',
      opacity: r.open ? 1 : 0.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    kind: r.kind,
    label: r.cat,
    h: 130,
    r: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10,
      display: 'flex',
      gap: 6
    }
  }, r.promo && /*#__PURE__*/React.createElement(Badge, {
    tone: "primary",
    solid: true
  }, r.promo), !r.open && /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    solid: true
  }, "Cerrado")), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      toggleFav(r.id);
    },
    "aria-label": "Favorito",
    style: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: fav[r.id] ? 'var(--color-primary)' : 'var(--color-text-secondary)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement(Ic.heart, {
    fill: fav[r.id] ? 'currentColor' : 'none'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 800,
      fontSize: 'var(--text-base)'
    }
  }, r.name), /*#__PURE__*/React.createElement(Badge, {
    tone: r.fee === 'Envío gratis' ? 'success' : 'neutral'
  }, r.fee)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement(MetaRow, {
    r: r
  }))))))));
}

/* ── Screen: Restaurant detail ── */
function DetailScreen({
  rid,
  onBack,
  cart,
  addItem,
  removeItem,
  onCheckout
}) {
  const r = RESTAURANTS.find(x => x.id === rid) || RESTAURANTS[0];
  const items = MENU[rid] || MENU.r1;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = items.reduce((sum, it) => sum + (cart[it.id] || 0) * it.price, 0);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    kind: r.kind,
    h: 180,
    r: "0"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Volver",
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'var(--shadow-md)'
    }
  }, /*#__PURE__*/React.createElement(Ic.back, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-2xl)',
      fontWeight: 800
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-text-secondary)',
      fontSize: 'var(--text-sm)',
      marginTop: 2
    }
  }, r.cat)), /*#__PURE__*/React.createElement(Badge, {
    tone: "success",
    dot: true
  }, "Abierto")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(MetaRow, {
    r: r
  })), r.promo && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      padding: 'var(--space-3) var(--space-4)',
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary-dark)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600
    }
  }, "\uD83C\uDF89 ", r.promo, " en tu primer pedido"), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 'var(--space-6)',
      marginBottom: 'var(--space-3)',
      fontSize: 'var(--text-lg)',
      fontWeight: 700
    }
  }, "M\xE1s pedidos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, items.map(it => {
    const q = cart[it.id] || 0;
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        flex: '0 0 64px'
      }
    }, /*#__PURE__*/React.createElement(Photo, {
      kind: it.kind,
      h: 64,
      r: "var(--radius-md)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 700,
        fontSize: 'var(--text-sm)'
      }
    }, it.name), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--text-xs)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, it.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        fontSize: 'var(--text-sm)',
        marginTop: 2
      }
    }, "$", it.price)), q === 0 ? /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": 'Añadir ' + it.name,
      icon: /*#__PURE__*/React.createElement(Ic.plus, null),
      variant: "surface",
      round: true,
      onClick: () => addItem(it.id)
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": "Quitar",
      icon: /*#__PURE__*/React.createElement(Ic.minus, null),
      variant: "surface",
      round: true,
      onClick: () => removeItem(it.id)
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800,
        minWidth: 16,
        textAlign: 'center'
      }
    }, q), /*#__PURE__*/React.createElement(IconButton, {
      "aria-label": "A\xF1adir",
      icon: /*#__PURE__*/React.createElement(Ic.plus, null),
      variant: "primary",
      round: true,
      onClick: () => addItem(it.id)
    })));
  }))), count > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-5)',
      borderTop: 'var(--border-default)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    onClick: onCheckout,
    trailingIcon: /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 800
      }
    }, "$", total)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: 'left'
    }
  }, "Ver carrito \xB7 ", count, " item", count > 1 ? 's' : ''))));
}

/* ── Screen: Checkout ── */
function CheckoutScreen({
  rid,
  cart,
  onBack,
  onPlace
}) {
  const items = (MENU[rid] || MENU.r1).filter(it => cart[it.id]);
  const subtotal = items.reduce((s, it) => s + cart[it.id] * it.price, 0);
  const fee = 0,
    service = 12;
  const total = subtotal + fee + service;
  const [tip, setTip] = useState(15);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-5)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Volver",
    icon: /*#__PURE__*/React.createElement(Ic.back, null),
    variant: "ghost",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xl)',
      fontWeight: 800
    }
  }, "Tu pedido")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 var(--space-5) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-primary)'
    }
  }, /*#__PURE__*/React.createElement(Ic.pin, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 'var(--text-sm)'
    }
  }, "Av. Reforma 222, Piso 4"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-text-secondary)',
      fontSize: 'var(--text-xs)'
    }
  }, "Entrega estimada 20\u201330 min")), /*#__PURE__*/React.createElement("span", {
    className: "fudie-link"
  }, "Cambiar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-4)'
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, cart[it.id], "\xD7"), " ", it.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700
    }
  }, "$", cart[it.id] * it.price)))), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 'var(--space-5)',
      marginBottom: 'var(--space-2)',
      fontSize: 'var(--text-base)',
      fontWeight: 700
    }
  }, "Propina"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, [10, 15, 20].map(p => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => setTip(p),
    style: {
      flex: 1,
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-md)',
      fontWeight: 700,
      fontSize: 'var(--text-sm)',
      background: tip === p ? 'var(--color-primary-subtle)' : 'var(--color-surface)',
      color: tip === p ? 'var(--color-primary-dark)' : 'var(--color-text)',
      border: tip === p ? 'var(--border-primary)' : 'var(--border-default)'
    }
  }, p, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      paddingTop: 'var(--space-4)',
      borderTop: 'var(--border-default)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--color-text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, "$", subtotal)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Env\xEDo"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-success-text)',
      fontWeight: 700
    }
  }, "Gratis")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Servicio + propina"), /*#__PURE__*/React.createElement("span", null, "$", service + Math.round(subtotal * tip / 100))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      color: 'var(--color-text)',
      fontWeight: 800,
      fontSize: 'var(--text-lg)',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", null, "$", total + Math.round(subtotal * tip / 100))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-5)',
      borderTop: 'var(--border-default)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    onClick: onPlace
  }, "Pagar $", total + Math.round(subtotal * tip / 100))));
}

/* ── Screen: Tracking ── */
function TrackingScreen({
  onDone
}) {
  const steps = [{
    t: 'Pedido confirmado',
    d: 'El restaurante lo está preparando',
    done: true
  }, {
    t: 'En preparación',
    d: 'Tacos al pastor en el comal',
    done: true
  }, {
    t: 'En camino',
    d: 'Carlos lo lleva en moto',
    done: false,
    active: true
  }, {
    t: 'Entregado',
    d: 'Av. Reforma 222',
    done: false
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    kind: "tacos",
    h: 170,
    r: "0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-full)',
      background: 'var(--color-primary-subtle)',
      color: 'var(--color-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Ic.clock, {
    s: 26
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-secondary)',
      fontWeight: 600
    }
  }, "Llega en"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 'var(--text-2xl)'
    }
  }, "18\u201324 min"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26,
      height: 26,
      borderRadius: 'var(--radius-full)',
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: s.done ? 'var(--color-success)' : s.active ? 'var(--color-primary)' : 'var(--gray-200)',
      color: '#fff'
    }
  }, s.done ? /*#__PURE__*/React.createElement(Ic.check, {
    s: 15
  }) : s.active ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#fff'
    }
  }) : null), i < steps.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 2,
      flex: 1,
      minHeight: 28,
      background: s.done ? 'var(--color-success)' : 'var(--gray-200)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 'var(--text-sm)',
      color: s.done || s.active ? 'var(--color-text)' : 'var(--color-text-secondary)'
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-xs)',
      color: 'var(--color-text-secondary)'
    }
  }, s.d))))), /*#__PURE__*/React.createElement(Card, {
    padding: "md",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Carlos M",
    size: "md"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 'var(--text-sm)'
    }
  }, "Carlos M."), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-text-secondary)',
      fontSize: 'var(--text-xs)'
    }
  }, "Tu repartidor")), /*#__PURE__*/React.createElement(Badge, {
    tone: "info",
    dot: true
  }, "En camino"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) var(--space-5)',
      borderTop: 'var(--border-default)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    variant: "secondary",
    onClick: onDone
  }, "Volver al inicio")));
}
function TabBar({
  active
}) {
  const tabs = [{
    k: 'home',
    i: Ic.home,
    l: 'Inicio'
  }, {
    k: 'bag',
    i: Ic.bag,
    l: 'Pedidos'
  }, {
    k: 'receipt',
    i: Ic.receipt,
    l: 'Historial'
  }, {
    k: 'user',
    i: Ic.user,
    l: 'Perfil'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderTop: 'var(--border-default)',
      padding: 'var(--space-2) 0 var(--space-3)',
      flex: '0 0 auto',
      background: 'var(--color-surface)'
    }
  }, tabs.map(t => {
    const on = t.k === active;
    return /*#__PURE__*/React.createElement("div", {
      key: t.k,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        color: on ? 'var(--color-primary)' : 'var(--color-text-secondary)'
      }
    }, /*#__PURE__*/React.createElement(t.i, null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: on ? 700 : 600
      }
    }, t.l));
  }));
}
Object.assign(window, {
  HomeScreen,
  DetailScreen,
  CheckoutScreen,
  TrackingScreen,
  TabBar,
  StatusBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/fudie-app/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Spinner = __ds_scope.Spinner;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
