import React from 'react';
import { Card, Button } from 'antd';
import { recipes } from '../../recipes/recipes.js';

var buttonList = []

for(let i = 0; i < Object.keys(recipes).length; i++) {
    console.log(recipes[i].title)
    buttonList.push(<Button
        key = {i}
        size = "large"
        block
        href={"/recipe/" + i}>{recipes[i].title}
        </Button>)
    buttonList.push(<br></br>)
    buttonList.push(<br></br>)
}

export default () => (
    <Card>
        {buttonList}
    </Card>
);