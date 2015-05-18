'use strict';

var React = require('react'),
	objectAssign = require('object-assign')
;

var components = {};
var typeCheckOrder = [];

var TypeProperty = React.createClass({
	components: {},
	typeCheckOrder: [],

	contextTypes: {
		typeDefaults: React.PropTypes.object,
		deepSettings: React.PropTypes.object
	},

	render: function() {
		var Component = this.getComponent(),
			settings = objectAssign(
				{},
				this.context.deepSettings,
				this.context.typeDefaults[ this.props.type ],
				this.props.settings
			)
		;

		console.log( this.context );

		return React.createElement( Component, {
			value: this.props.value,
			settings: settings,
			onUpdated: this.props.onUpdated,
			ref: 'property'
		});
	},

	getComponent: function(){
		var type = this.props.type;
		if( !type )
			type = this.guessType( this.props.value );

		this.propertyType = type;

		return this.components[ type ];
	},

	guessType: function( value ){
		var type = false,
			i = 0,
			types = this.typeCheckOrder
		;

		while( !type && i < types.length ){
			if( this.components[ types[i] ].prototype.isType( value ) )
				type = types[i++];
			else
				i++;
		}

		return type || 'object';
	},

	getValidationErrors: function( jsonValue ){
		return this.refs.property.getValidationErrors( jsonValue );
	}
});

TypeProperty.registerType = function( name, Component, selectable ){
	var proto = TypeProperty.prototype;
	proto.components[ name ] = Component;
	if( selectable )
		proto.typeCheckOrder.unshift( name );
};

module.exports = TypeProperty;