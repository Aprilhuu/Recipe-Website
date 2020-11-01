import React, { Component } from 'react';
import { Card, List, Popover, Checkbox, PageHeader, Button } from 'antd';
import axios from 'axios';

import defaultSettings from '../../config/defaultSettings';
const { api_endpoint } = defaultSettings

class ShoppingList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listItem: []
        }
    }

    onChange(e) {
        console.log(e.currentTarget)
        console.log(`checked = ${e.target.checked}`);
    }

    // how do we want to save the shopping list?
    printStatus() {
        for (let i = 0; i < document.getElementsByClassName("ant-list-item").length; i++) {
            console.log(document.getElementsByClassName("ant-list-item")[i].childNodes)
        }
        
    }

    // after the component is rendered
    componentDidMount(){
        axios.get(api_endpoint+'/v1/users/meal_plan/shopping_list', {}).then(
            response => { 
                let listItem = []

                // get the response and parse
                console.log(response.data.result)
                for (const [key, value] of Object.entries(response.data.result)) {
                    let popoverItem = [];
                    for (const [key, value] of Object.entries(value.detail)) {

                        // popup that shows after hovering each shopping list item
                        popoverItem.push(
                            <div key={value.recipe_id}>
                                <a href={"/recipe/" + value.recipe_id}>{value.recipe_title}</a> needs {value.quantity} of this ingredient
                            </div>
                        )
                    }

                    const popoverKey = key + '-popover'

                    // each shopping list item
                    listItem.push(
                        <List.Item key={key}>
                            <List.Item.Meta 
                                title={key}
                                description={
                                <Popover key={popoverKey} content={popoverItem} title="Recipe and Amount Needed">
                                    <div>Needed amount for all recipes: {value.quantity}</div>
                                </Popover>
                            }
                            /> 
                            <Checkbox onChange={this.onChange}></Checkbox>
                        </List.Item>
                    )
                }

                // update the page once the api call is complete
                this.setState({ listItem: listItem})
            })
    }

    render() {
        return(
            <Card>
                <PageHeader
                    title="Shopping List"
                    onBack={() => window.history.back()}
                    subTitle={<span>This list is automatically populated with ingredients from your <a href='meal-planner'>Meal Planner</a>!</span>}
                >

                </PageHeader>
                <Button onClick={this.printStatus}>Save</Button>
                <br></br>
                <br></br>
                <List
                    size="small"
                    bordered
                    style={{ width: '50%' }}
                >
                    {this.state.listItem}
                </List>
                
            </Card>
        );
    }

}

export default ShoppingList