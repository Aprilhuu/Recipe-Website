import React, { Component } from 'react';
import { Card, List, Popover, Checkbox, PageHeader, notification } from 'antd';
import axios from 'axios';
import { CheckOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';

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

    openNotification = (title, description) => {
        notification.open({
            message: title,
            description: description,
            duration: 8,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    }

    onChange(e) {

        // console.log(this)
        // console.log(e)

        // get the id
        let parsed_id = e.target.id.split("-")
        let entry_id = parsed_id[0]
        let checkboxType = parsed_id[1]
    
        let { tickedListInfo, listInfo } = this.state;
        if (checkboxType == 'tickbox') {
            this.openNotification('1 item ticked', 'If this was a misclick, click the \'+\' button in your Ticked Items list below to add the item back.')

            // move to ticked list
            tickedListInfo[entry_id] = JSON.parse(JSON.stringify(listInfo[entry_id]))
            delete listInfo[entry_id]
            this.setState({ tickedListInfo: tickedListInfo, listInfo: listInfo })
        } else {
            // move back to checked list
            this.openNotification('1 item unticked', '')

            listInfo[entry_id] = JSON.parse(JSON.stringify(tickedListInfo[entry_id]))
            delete tickedListInfo[entry_id]
            this.setState({ tickedListInfo: tickedListInfo, listInfo: listInfo })
        }

        //update shopping list
        this.updateList(listInfo, false)
        
        //update ticked list
        this.updateList(tickedListInfo, true)
    }

    updateList(list, tickedItems) {
        let items = [];
        let { curId } = this.state;
        let listInfo = null;

        // curId == 0 only if the shopping list is empty
        // and we're going to populate it for the first time
        // existance of listInfo is used to check for first time later on
        if (curId == 0) {
            listInfo = {};
        }


        for (const [key, value] of Object.entries(list)) {
            let popoverItem = [];

            // initial update
            if (typeof listInfo != 'undefined' && listInfo != null) {
                listInfo[curId] = {};
                listInfo[curId].quantity = value.quantity;
                listInfo[curId].detail = value.detail;
                listInfo[curId].title = key
            }

            let i = 0;
            for (const [key, value] of Object.entries(value.detail)) {
            
                // popup that shows after hovering each shopping list item
                popoverItem.push(
                    <div key={i}>
                        <a href={"/recipe/" + value.recipe_id}>{value.recipe_title}</a> needs {value.quantity} of this ingredient
                    </div>
                )
            i++;
            }

            const checkbox = []
            let checkboxId = key;
            let titleKey = value.title;

            // initial update
            if (typeof listInfo != 'undefined' && listInfo != null) {
                checkboxId = curId;
                titleKey = key
            }

            let checkSign;
            if (tickedItems) {
                checkboxId += '-addbackbox';
                checkSign = <PlusOutlined />
            } else {
                checkboxId += '-tickbox';
                checkSign = <CheckOutlined/>
            }
                
            checkbox = <Checkbox id={checkboxId} onChange={this.onChange}>
                    {checkSign}
                </Checkbox>

            const popoverKey = titleKey + '-popover'
            items.push(
                <List.Item key={titleKey}>
                    <List.Item.Meta 
                        title={titleKey}
                        description={
                        <Popover key={popoverKey} content={popoverItem} title="Recipe and Amount Needed">
                            <div>Needed amount for all recipes: {value.quantity}</div>
                        </Popover>
                    }
                    /> 
                    {checkbox}
                </List.Item>
            )
            
            // initial update
            if (typeof listInfo != 'undefined' && listInfo != null) curId++;
        }
        // initial update
        if (typeof listInfo != 'undefined' && listInfo != null) {
            this.setState({ listItem: items, curId: curId, listInfo: listInfo})
        } else {
            if (tickedItems) this.setState({ tickedListItem: items })
            else this.setState({ listItem: items })
        }
    }

    // after the component is rendered
    componentDidMount(){
        axios.get(api_endpoint+'/v1/users/meal_plan/shopping_list', {}).then(
            response => { 
                this.updateList(response.data.result, false);
            })
    }

    render() {
        return(
            <Card style={{ width: '50%', margin: 'auto' }}>
                <PageHeader
                    title="Shopping List"
                    onBack={() => window.history.back()}
                    subTitle={<span>This list is automatically populated with ingredients from your <a href='meal-planner'>Meal Planner</a>!</span>}
                >
                </PageHeader>

                <div style={{ margin: 'auto' }}>
                    <List
                        bordered
                        header={<div style={{fontSize: '2em'}}>For Your Next Grocery Trip</div>}
                        style={{marginTop: '50px', backgroundColor: 'white'}}
                    >
                        {this.state.listItem}
                    </List>
                    <List
                        bordered
                        header={<div style={{fontSize: '2em'}}>Ticked Items</div>}
                        style={{marginTop: '50px', backgroundColor: '#fafafa'}}
                    >
                        {this.state.tickedListItem}
                    </List>
                </div>
                
            </Card>
        );
    }

}

export default ShoppingList