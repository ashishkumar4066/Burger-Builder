import React, { Component } from 'react';
import axios from '../../axios';

import Order from '../../components/Order/Order';

class Orders extends Component {
	state = {
		orders: [],
		loading: true
	};
	componentDidMount() {
		console.log('In Orders.js ' + this.props.token);
		axios.get('/orders.json').then(res => {
			const fetchedOrders = [];
			for (let key in res.data) {
				fetchedOrders.push({ ...res.data[key], id: key });
			}
			this.setState({ orders: fetchedOrders, loading: false });
		});
	}
	render() {
		return (
			<div>
				{this.state.orders.map(order => (
					<Order
						key={order.id}
						ingredients={order.ingredients}
						price={+order.price} // orders coming from database are string so it needs to be converted
					/>
				))}
			</div>
		);
	}
}
export default Orders;
