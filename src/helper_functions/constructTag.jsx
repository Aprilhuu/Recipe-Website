import { Tag } from 'antd';
import React from "react";

/**
 * This function is used to construct a list of tag components based on tags available
 * in recipe data JSON.
 *
 * @param tagData A list of strings for tags fetched from raw recipe data
 *
 * @return {[]} Return a list of Tag components.
 */
export default function constructTag(tagData){
    const tagList = []
  
    for(let i = 0; i < tagData.length; i++) {
      tagList.push(<Tag color="volcano" key = { "recipeTag" + i }>{ tagData[i] }</Tag>);
    }
    return tagList;
  }