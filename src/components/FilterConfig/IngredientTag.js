import React, {Component} from 'react';
import {Input, Tag, Tooltip} from 'antd';

const { Search } = Input;

class IngredientTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      inputVisible: true,
      inputValue: '',
      editInputIndex: '',
      editInputValue: '',
    };
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter((tag) => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);

    const { updateIngredientsTagsList } = this.props;
    updateIngredientsTagsList(tags);

    this.setState({
      tags,
      inputVisible: true,
      inputValue: '',
    });
  };

  handleEditInputChange = (e) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    this.setState(({ tags, editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: '',
        editInputValue: '',
      };
    });
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  saveEditInputRef = (input) => {
    this.editInput = input;
  };

  render() {
    const { tags, inputValue, editInputIndex, editInputValue } = this.state;
    return (
      <>
        <Search
          placeholder="Enter an Ingredient"
          allowClear
          size="large"
          onSearch={this.handleInputConfirm}
          style={{width: '100%'}}
          ref={this.saveInputRef}
          type="text"
          className="tag-input"
          value={inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirm}
          enterButton="Add"
          />
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="large"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={index >= 0}
              onClose={() => this.handleClose(tag)}
              style={{ lineHeight: '30px', fontSize: '16px', marginTop: '8px' }}
            >
              <span
                onDoubleClick={(e) => {
                  if (index !== 0) {
                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }
                }}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
      </>
    );
  }
}
export default IngredientTag;
