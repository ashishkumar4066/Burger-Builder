import React from 'react';

import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.css';
const CheckoutSummary = props => {
	return (
		<div className={classes.CheckoutSummary}>
			<h1>We hope you like our burger</h1>
			<div style={{ width: '100%', height: '300px', margin: 'auto' }}>
				<Burger ingredients={props.ingredients} />
			</div>
			<div style={{ marginTop: '110px' }}>
				<Button btnType="Danger" clicked={props.checkoutContinued}>
					Cancel
				</Button>
				<Button btnType="Success" clicked={props.checkoutCancelled}>
					Continue
				</Button>
			</div>
		</div>
	);
};
export default CheckoutSummary;
