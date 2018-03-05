'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.not = exports.or = exports.and = exports.isUndefined = exports.isNull = exports.isFalse = exports.isTrue = exports.between = exports.lte = exports.gte = exports.lt = exports.gt = exports.eq = exports.Default = exports.Clause = exports.value = exports.T = exports.Cond = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Could use ES6 symbols in future
var CASE_SYMBOL = "__is-react-cond-component";

var isFunction = function isFunction(func) {
	return typeof func === 'function';
};
var isEqual = function isEqual(a, b) {
	return a === b;
};

var makeClause = function makeClause(compare) {
	return function (_ref) {
		var _ref2 = _slicedToArray(_ref, 2),
		    condition = _ref2[0],
		    result = _ref2[1];

		return isFunction(condition) ? [condition, result] : [function (x) {
			return compare(x, condition);
		}, result];
	};
};

var findFirst = function findFirst(arr, cond) {
	return arr.filter(function (_val, i) {
		return cond(arr[i]);
	})[0];
};

var createReactClass = require('create-react-class');

var Cond = exports.Cond = createReactClass({
	displayName: 'Cond',
	getDefaultProps: function getDefaultProps() {
		return {
			compare: isEqual
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(_ref3) {
		var nextValue = _ref3.value,
		    nextCompare = _ref3.compare;
		var _props = this.props,
		    compare = _props.compare,
		    value = _props.value;


		if (compare !== nextCompare || value !== nextValue) this.forceUpdate();
	},
	render: function render() {
		var _props2 = this.props,
		    children = _props2.children,
		    compare = _props2.compare,
		    value = _props2.value;

		var clauses = [];

		if (Array.isArray(children[0])) {
			clauses = children;
		} else if (children[0] && children[0].props && children[0].props[CASE_SYMBOL]) {
			// multiple clauses
			clauses = children.map(function (c) {
				return [c.props.test, c.props.children];
			});
		} else if (children && children.props && children.props[CASE_SYMBOL]) {
			// single clause
			clauses = [[children.props.test, children.props.children]];
		} else {
			clauses = [children];
		}

		var normalized = clauses.map(function (clause) {
			return Array.isArray(clause) ? makeClause(compare)(clause) : [T, clause];
		});

		var _findFirst = findFirst(normalized, function (_ref4) {
			var _ref5 = _slicedToArray(_ref4, 2),
			    condition = _ref5[0],
			    result = _ref5[1];

			return condition(value);
		}),
		    _findFirst2 = _slicedToArray(_findFirst, 2),
		    condition = _findFirst2[0],
		    result = _findFirst2[1];

		return result;
	}
});

var T = exports.T = function T() {
	return true;
};
var value = exports.value = function value(name, condition) {
	return function (val) {
		return condition(val[name]);
	};
};

var Clause = exports.Clause = _react2.default.createClass({
	displayName: 'Clause',
	getDefaultProps: function getDefaultProps() {
		return _defineProperty({}, CASE_SYMBOL, true);
	},
	render: function render() {
		return null;
	}
});

var Default = exports.Default = _react2.default.createClass({
	displayName: 'Default',
	getDefaultProps: function getDefaultProps() {
		return _defineProperty({
			test: T
		}, CASE_SYMBOL, true);
	},
	render: function render() {
		return null;
	}
});

var wrap = function wrap(fn) {
	var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		if (args.length >= count + 1) {
			var name = args[0],
			    params = args.slice(1);

			return value(name, fn.apply(undefined, _toConsumableArray(params)));
		} else {
			return fn.apply(undefined, args);
		}
	};
};

var eq = exports.eq = wrap(function (x) {
	return function (y) {
		return x === y;
	};
});
var gt = exports.gt = wrap(function (x) {
	return function (y) {
		return y > x;
	};
});
var lt = exports.lt = wrap(function (x) {
	return function (y) {
		return y < x;
	};
});
var gte = exports.gte = wrap(function (x) {
	return function (y) {
		return y >= x;
	};
});
var lte = exports.lte = wrap(function (x) {
	return function (y) {
		return y <= x;
	};
});
var between = exports.between = wrap(function (x, y) {
	return function (val) {
		return x < val && val < y;
	};
}, 2);
var isTrue = exports.isTrue = eq(true);
var isFalse = exports.isFalse = eq(false);
var isNull = exports.isNull = eq(null);
var isUndefined = exports.isUndefined = eq(undefined);

var and = exports.and = function and(x, y) {
	return function (val) {
		return x(val) && y(val);
	};
};
var or = exports.or = function or(x, y) {
	return function (val) {
		return x(val) || y(val);
	};
};
var not = exports.not = function not(x) {
	return function (val) {
		return !x(val);
	};
};