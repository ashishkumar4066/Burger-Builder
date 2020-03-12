import React, { Component } from 'react';
import axios from 'axios';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Mail Address'
				},
				value: '',
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Password'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		},
		isSignup: true,
		loading: false,
		token: null,
		userId: null,
		error: null
	};

	checkValidity(value, rules) {
		let isValid = true;
		if (!rules) {
			return true;
		}

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		return isValid;
	}

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(
					event.target.value,
					this.state.controls[controlName].validation
				),
				touched: true
			}
		};
		this.setState({ controls: updatedControls });
	};
	checkAuthTimeout = expirationTime => {
		setTimeout(this.setState({ token: null, userId: null }), expirationTime);
	};
	submitHandler = event => {
		event.preventDefault();
		this.setState({ loading: true });
		let url =
			'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
		if (this.state.isSignup) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
		}
		const authData = {
			email: this.state.controls.email.value,
			password: this.state.controls.password.value,
			returnSecureToken: true
		};

		axios
			.post(url, authData)
			.then(response => {
				this.setState({
					loading: false,
					token: response.data.idToken,
					userId: response.data.localId
				});

				this.checkAuthTimeout(response.data.expiresIn);
			})
			.catch(error => {
				this.setState({ error: error });
				console.log(this.state.error);
			});
	};
	switchAuthHandler = () => {
		this.setState(prevstate => {
			return { isSignup: !prevstate.isSignup };
		});
	};
	render() {
		const formElementsArray = [];
		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}

		const form = formElementsArray.map(formElement => (
			<Input
				key={formElement.id}
				elementType={formElement.config.elementType}
				elementConfig={formElement.config.elementConfig}
				value={formElement.config.value}
				invalid={!formElement.config.valid}
				shouldValidate={formElement.config.validation}
				touched={formElement.config.touched}
				changed={event => this.inputChangedHandler(event, formElement.id)}
			/>
		));
		let formSubmit = (
			<div>
				<h1>{this.state.isSignup ? 'SignUp' : 'SignIn'}</h1>
				<form onSubmit={this.submitHandler}>
					{form}
					<Button btnType="Success">SUBMIT</Button>
				</form>
				<Button btnType="Danger" clicked={this.switchAuthHandler}>
					SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
				</Button>
			</div>
		);
		if (this.state.loading) {
			formSubmit = <Spinner />;
		}

		return (
			<div className={classes.Auth}>
				{formSubmit}
				{/* <Route to={'/orders/'+this.state.token} exact component={Orders} /> */}
				{/* <Orders token={this.state.token} /> */}
			</div>
		);
	}
}
export default Auth;
