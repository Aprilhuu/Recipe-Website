/* eslint-disable no-restricted-syntax */
import React, { Component } from 'react';
import { Card, List, Popover, Checkbox, PageHeader, notification } from 'antd';
import axios from 'axios';
import { CheckOutlined, PlusOutlined, SmileOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import Store from "./storage";
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

    // after the component is rendered
    componentDidMount() {
        const username = localStorage.getItem('username')

        // if shopping list api is empty, get ingredients from the meal planner
        // otherwise, get ingredients from the shopping list api
        axios.get(`${api_endpoint}/v1/users/shopping_list`, {
            headers: {"Authorization":username}
        })
        .then(response => {
            if (Object.keys(response.data.result).length === 0 && response.data.result.constructor === Object) {
                axios.get(`${api_endpoint}/v1/users/meal_plan/shopping_list`, {
                    headers: {"Authorization":username}
                }).then(
                    meal_plan_response => {
                        this.updateList(meal_plan_response.data.result, false);
                    })
            } else {
                this.setState({
                    listInfo: response.data.result.listInfo,
                    tickedListInfo: response.data.result.tickedListInfo,
                    curId: response.data.result.curId
                })

                this.updateList(response.data.result.listInfo, false)
                this.updateList(response.data.result.tickedListInfo, true)
            }
        }).catch((error) => {
            console.log(error);
        });
        Store.clearResultList()
    }

    /**
     * This function is called when a checkbox or + box is ticked. If it detects a checkbox, then the ingredient will be moved
     * to the Ticked Items list. If it detects a + box, the ingredient will be moved back to the Shopping List.
     *
     * @param {Event} e This is the event. We will use this to extract the id of the recipe that is checked.
     *
     */
    onChange(e) {
        // get the id
        const parsed_id = e.target.id.split("-")
        const entry_id = parsed_id[0]
        const checkboxType = parsed_id[1]

        const { tickedListInfo, listInfo } = this.state;

        if (checkboxType === 'tickbox') {
            this.openNotification('1 item ticked', 'If this was a misclick, click the \'+\' button in your Ticked Items list below to add the item back.')

            // move to ticked list
            tickedListInfo[entry_id] = JSON.parse(JSON.stringify(listInfo[entry_id]))
            delete listInfo[entry_id]
            this.setState({ tickedListInfo, listInfo })
        } else {
            // move back to checked list
            this.openNotification('1 item unticked', '')

            listInfo[entry_id] = JSON.parse(JSON.stringify(tickedListInfo[entry_id]))
            delete tickedListInfo[entry_id]
            this.setState({ tickedListInfo, listInfo })
        }

        // update shopping list
        this.updateList(listInfo, false)

        // update ticked list
        this.updateList(tickedListInfo, true)

        const { curId } = this.state;

        const username = localStorage.getItem('username');
        axios.post(`${api_endpoint}/v1/users/shopping_list`, {
            'shopping_list' : {
                'tickedListInfo': tickedListInfo,
                'listInfo': listInfo,
                'curId': curId
            }
          },
          {
            headers: {"Authorization": username},
          })
    }


    /**
     * This function is used to show the notification of a shopping list item being ticked or unticked.
     *
     * @param {string} title Main title of the notification.
     * @param {string} description Main description of the notification.
     *
     */
    openNotification = (title, description) => {
        notification.open({
            message: title,
            description,
            duration: 8,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
    }

    /**
     * This function is used update the shopping list or ticked items list using their respective list info.
     *
     * @param {string} list The shopping list or ticked items list
     * @param {bool} tickedItems If true, the passed in list is the ticked items list. Else, it is the original shopping list.
     *
     */
    updateList(list, tickedItems) {
        const items = [];
        let { curId } = this.state;
        let listInfo = null;

        // curId == 0 only if the shopping list is empty
        // and we're going to populate it for the first time
        // existance of listInfo is used to check for first time later on
        if (curId === 0) {
            listInfo = {};
        }

        for (const [key, value] of Object.entries(list)) {
            const popoverItem = [];

            // initial update
            if (typeof listInfo !== 'undefined' && listInfo != null) {
                listInfo[curId] = {};
                listInfo[curId].quantity = value.quantity;
                listInfo[curId].detail = value.detail;
                listInfo[curId].title = key
            }

            let i = 0;
            for (const [, detailed_value] of Object.entries(value.detail)) {

                // popup that shows after hovering each shopping list item
                popoverItem.push(
                    <div key={i}>
                        <Link to={`/recipe/${detailed_value.recipe_id}`}>{detailed_value.recipe_title}</Link> needs {detailed_value.quantity} of this ingredient
                    </div>
                )
            i += 1;
            }

            let checkbox = []
            let checkboxId = key;
            let titleKey = value.title;

            // initial update
            if (typeof listInfo !== 'undefined' && listInfo != null) {
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

            const popoverKey = `${titleKey}-popover`
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
            if (typeof listInfo !== 'undefined' && listInfo != null) curId += 1;
        }
        // initial update
        if (typeof listInfo !== 'undefined' && listInfo != null) {
            this.setState({ listItem: items, curId, listInfo })
        } else if (tickedItems) this.setState({ tickedListItem: items })
        else this.setState({ listItem: items })
    }

    render() {
        return(
            <Card style={{ minWidth: '420px', width: '50%', margin: 'auto' }}>
                <PageHeader
                    title="Shopping List"
                    onBack={() => window.history.back()}
                    subTitle={<span>This list is automatically populated with ingredients from your 
                        <Link to='/meal-planner'> Meal Planner</Link>!</span>}
                />

                <div style={{ margin: 'auto' }}>
                    <List
                        bordered
                        header={<div style={{fontSize: '2em'}}>Your Shopping List</div>}
                        style={{backgroundColor: 'white'}}
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
