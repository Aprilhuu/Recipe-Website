import React, {createElement, PureComponent, useEffect, useState} from 'react';
import {Comment, Tooltip, Row, List, Typography, Form, Button, Input} from 'antd';
import moment from 'moment';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import styles from './recipeComments.less';
import axios from "axios";
import defaultSettings from "../../../config/defaultSettings";

const { Title } = Typography;
const { TextArea } = Input;
const {api_endpoint} = defaultSettings;
const commentAvatar = 'https://media.istockphoto.com/vectors/chef-icon-vector-id930443798?b=1&k=6&m=930443798&s=612x612&w=0&h=0Aird0vBFPJmJYr_2TSZk9WwXLU9cPkhQiS_K-_UGsw=';


// // TODO: Hacking with dummy comments for now
// const commentData = [
//   {
//     author: 'April',
//     content: "We supply a series of design principles, practical patterns and high quality design " +
//       "resources (Sketch and Axure), to help people create their product prototypes beautifully and " +
//       "efficiently.",
//     datetime: "2020-11-03 13:40:45",
//     like: 1,
//     dislike: 2
//   },
//   {
//     author: 'Color',
//     content: "We supply a series of design principles, practical patterns and high quality design " +
//       "resources (Sketch and Axure), to help people create their product prototypes beautifully and " +
//       "efficiently.",
//     datetime: "2020-11-01 13:40:45",
//     like: 3,
//     dislike: 0
//   },
// ];


/**
 * This function is used to construct each comment item within the comment list
 *
 * @param {object} comment A JSON containing all information about one comment
 *
 * @return Ant design Comment element for one comment
 */
const CommentItem = ( {comment, index} ) => {
  // Used for setting like and dislike button
  const [likes, setLikes] = useState(comment.like);
  const [dislikes, setDislikes] = useState(comment.dislike);
  const [action, setAction] = useState(null);

  useEffect(() => { setLikes(comment.like)}, [comment.like] )
  useEffect(() => { setDislikes(comment.dislike)}, [comment.dislike] )

  const like = () => {
    setLikes(comment.like + 1);
    setDislikes(comment.dislike);
    setAction('liked');

  };

  const dislike = () => {
    setLikes(comment.like);
    setDislikes(comment.dislike + 1);
    setAction('disliked');
  };

  const actions = [
    <Tooltip key="comment-basic-like" title="Like">
          <span onClick={like}>
            {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
            <span className="comment-action">{likes}</span>
          </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
          <span onClick={dislike}>
            {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
            <span className="comment-action">{dislikes}</span>
          </span>
    </Tooltip>,
  ];

  return(
    <Comment
      actions={actions}
      author={comment.author}
      avatar={commentAvatar}
      content={comment.content}
      datetime={
        <Tooltip title={comment.datetime}>
          <span>{moment(comment.datetime, 'YYYY-MM-DD HH:mm:ss').fromNow()}</span>
        </Tooltip>
      }
    />
  );
}


/**
 * This function is used to construct the entire comment list
 *
 * @param {[object]} commentData An array of comment objects
 *
 * @return Ant design List element for all comments
 */
const CommentList = ( { commentData } ) => (
  <List
    style={{width: '100%'}}
    className="comment-list"
    header={`${commentData.length} ${commentData.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    dataSource={commentData}
    renderItem={(comment, index) => <CommentItem comment={comment} index={index}/>}
  />
);


/**
 * This function is used to construct the form for submitting comments
 *
 * @param onChange callback function used to update state containing comment body
 * @param onChangeName callback function used to update state containing user nickname
 * @param onSubmit callback function used to handle form submission
 * @param {boolean} submitting Boolean indicating if in the process of form submission
 * @param {string} value current value in comment submission box
 * @param {string} name current nickname in name submission box
 *
 * @return Ant design Form element for entering comments
 */
const Editor = ({ onChange, onChangeName, onSubmit, submitting, value, name }) => (
  <Form size="large" labelAlign="left" layout="vertical">
    <Form.Item
      name={['user', 'name']}
      label="Name"
      rules={[{required: true}]}
    >
      <Input onChange={onChangeName} value={name}/>
    </Form.Item>
    <Form.Item
      name={['user', 'comment']}
      label="Comment"
      rules={[{required: true}]}>
      <TextArea rows={4} onChange={onChange} value={value}/>
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Add Comment
      </Button>
    </Form.Item>
  </Form>
);


/**
 * This class represent the entire comment section in recipe detail page. It contains displaying
 * available comments and a form for submitting new comments.
 */
class CommentSection extends PureComponent {
  state = {
    comments: [],
    submitting: false,
    value: '',
    name: '',
    recipeID: ''
  };

  constructor(props) {
    super(props);
    this.state.comments = props.commentData;
    this.state.recipeID = props.recipeID;
  }

  handleSubmit = () => {
    if (!this.state.value || !this.state.name) {
      return;
    }

    this.setState({
      submitting: true,
    });

    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date+' '+time;

    const newComment = {
      author: this.state.name,
      content: this.state.value,
      datetime: dateTime,
      like: 0,
      dislike: 0
    }

    axios.post(api_endpoint +'/v1/reviews/'+ this.state.recipeID, {"comment": newComment})
      .then(response =>{})

    this.setState({
      submitting: false,
      value: '',
      name: '',
      reload: true,
      comments: [
        ...this.state.comments,
        newComment
      ],
    });
  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };

  handleChangeName = e => {
    this.setState({
      name: e.target.value
    });
  };

  render() {
    const { comments, submitting, value, name } = this.state;

    // If no comment data found for this recipe, customize displayed message
    let commentComponent;
    if (!comments.length){
      commentComponent = <Title level={4} style={{width: '100%', textAlign: 'center'}}>
        No comments yet. Be the first one to leave a comment! </Title>
    }
    else{
      commentComponent = <CommentList commentData={comments} />
    }

    return (
      <div>
        {/* Row 1: Displaying all comments */}
        <Row className={ styles.rowContent } align="bottom">
          <Title level={2} style={{width: '100%'}}> COMMENTS: </Title>
          { commentComponent }
        </Row>
        {/* Row 2: Form for submitting new comments */}
        <Row className={ styles.rowContent } align="bottom">
          <Title level={2} style={{width: '100%', marginBottom: '0px'}}> Leave a comment </Title>
          <Comment style={{width: '50%'}}
                   content={
                     <Editor
                       onChange={this.handleChange}
                       onSubmit={this.handleSubmit}
                       onChangeName={this.handleChangeName}
                       submitting={submitting}
                       value={value}
                       name={name}
                     />
                   }/>
        </Row>
      </div>
    );
  }
}

export default CommentSection;
