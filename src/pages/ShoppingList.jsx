import React, { Component } from 'react';
import { Card, List, Popover, Checkbox, PageHeader, Button } from 'antd';
import axios from 'axios';

import defaultSettings from '../../config/defaultSettings';
const { api_endpoint } = defaultSettings

class ShoppingList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listInfo: {}, 
            listItem: [],
            tickedListInfo: {},
            tickedListItem: [],
            curId: 0
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        // get the id
        console.log(this)
        console.log(e)

        let entry_id = e.target.id.split("-")[0]
        
        // move to ticked list
        let { tickedListInfo, listInfo } = this.state;
        // console.log(listInfo);
        tickedListInfo[entry_id] = JSON.parse(JSON.stringify(listInfo[entry_id]))
        delete listInfo[entry_id]
        this.setState({ tickedListInfo: tickedListInfo, listInfo: listInfo })

        this.updateList(listInfo, false)
        this.updateList(tickedListInfo, true)
    }

    // how do we want to save the shopping list?
    printStatus() {
        for (let i = 0; i < document.getElementsByClassName("ant-list-item").length; i++) {
            console.log(document.getElementsByClassName("ant-list-item")[i].childNodes)
        }
        
    }

    updateList(list, tickedItems) {
        let items = [];

        for (const [key, value] of Object.entries(list)) {
            let popoverItem = [];

            for (const [key, value] of Object.entries(value.detail)) {

                // popup that shows after hovering each shopping list item
                popoverItem.push(
                    <div key={value.recipe_id}>
                        <a href={"/recipe/" + value.recipe_id}>{value.recipe_title}</a> needs {value.quantity} of this ingredient
                    </div>
                )
            }

            const popoverKey = value.title + '-popover'
            const checkbox = []
            if (!tickedItems) checkbox = <Checkbox id={key + '-checkbox'} onChange={this.onChange}></Checkbox>
            
            // each shopping list item
            items.push(
                <List.Item key={value.title}>
                    <List.Item.Meta 
                        title={value.title}
                        description={
                        <Popover key={popoverKey} content={popoverItem} title="Recipe and Amount Needed">
                            <div>Needed amount for all recipes: {value.quantity}</div>
                        </Popover>
                    }
                    /> 
                    {checkbox}
                </List.Item>
            )

            console.log(items)
            if (tickedItems) this.setState({ tickedListItem: items })
            else this.setState({ listItem: items })
        }
    }

    // after the component is rendered
    componentDidMount(){
        axios.get(api_endpoint+'/v1/users/meal_plan/shopping_list', {}).then(
            response => { 
                let listItem = [];
                let listInfo = {};
                let { curId } = this.state;

                // get the response and parse
                for (const [key, value] of Object.entries(response.data.result)) {
                    let popoverItem = [];
                
                    listInfo[curId] = {};
                    listInfo[curId].quantity = value.quantity;
                    listInfo[curId].detail = value.detail;
                    listInfo[curId].title = key

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
                            <Checkbox id={curId + '-checkbox'} onChange={this.onChange}></Checkbox>
                        </List.Item>
                    )

                    curId++;
                }

                // update the page once the api call is complete
                this.setState({ listItem: listItem, curId: curId, listInfo: listInfo})
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
                {/* <Button onClick={this.printStatus}>Save</Button> */}
                <br></br>
                <br></br>
                <div style={{ margin: 'auto', width: '30%' }}>
                    <List
                        bordered
                        header={<div style={{fontSize: '2em'}}>For Your Next Grocery Trip</div>}
                    >
                        {this.state.listItem}
                    </List>
                    <List
                        bordered
                        header={<div style={{fontSize: '2em'}}>Ticked Items</div>}
                        style={{marginTop: '50px'}}
                    >
                        {this.state.tickedListItem}
                    </List>
                </div>
                
            </Card>
        );
    }

}

export default ShoppingList