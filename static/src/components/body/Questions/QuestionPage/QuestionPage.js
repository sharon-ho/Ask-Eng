import React, {Component} from 'react'
import {fetchAPI} from '../../../utility'
import {Col, Row, Well, Image} from 'react-bootstrap'
import Answer from './Answer.js'
import AnswerQuestion from './AnswerQuestion.js'
import moment from 'moment'
import Votes from "../../../votes/Votes";
import { connect } from 'react-redux'

class QuestionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                answers: []
            },
            fname: "",
            lname: "",
            display_image: "",
            user_id: "",
            loading: true
        }
		this.answerHandler = this.answerHandler.bind(this);
    }

    answerHandler() {
        this.getQuestion()
    }

    componentDidMount(){
        this.getQuestion()
    }

    componentWillMount() {
      this.setState({loading: true});
    }

    async getQuestion() {
        try {
            fetchAPI("GET", "/api/qa/questions/?question_id=" + this.props.match.params.id + "&loggedin_id=" + this.props.user.id).then(response => {
                if (response.success) {
                    this.setState({
                        question: response.question,
                        loading: false,
                        user_id: response.question.user_id
                    }, ()=>this.getUser())
                }
            })
        } catch (e) {
            console.error("Error:", e)
        }
    }

    async getUser() {
        try {
            fetchAPI("GET", "/api/users/" + this.state.user_id).then(response => {
            if (response.success) {
                this.setState({
                    fname: response.user.fname,
                    lname: response.user.lname,
                    display_image: response.user.display_image
                })
            }})
        } catch (e) {
            console.error("Error:", e)
        }
    }

    render() {
        let avatarPath = `\\images\\avatar\\`+this.state.display_image;
        if (!this.state.loading) {
            let answers = this.state.question.answers.map((answer) => {
                return (
                    <div key={answer.id}>
                        <Answer
                            user={this.props.user}
                            answer={answer}
                        />
                    </div>
            )});

            return (
                <div className="answer-page">
                    <Row>
                        <Col md={12}>
                            <span className="question-tag">{this.state.question.engineer}</span>
                            posted on {moment(this.state.question.register_date).format("LL")}                           
                             by <Image src={avatarPath} width={24} circle /> {this.state.fname} {this.state.lname} 
                        </Col>
                    </Row>
                    <Row className="question-box-text">
                        <Col xs={1} md={1}>
                            <Votes
                                question={this.state.question}
                                status = {this.state.question.vote_status}
                                user={this.props.user}
                                comment_status = {'question'}
                            /> 
                        </Col>
                        <Col xs={11} md={11}>
                            <h1>{this.state.question.title}</h1>
                            <p>{this.state.question.text}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Well bsSize="large">
                                <h2> Know the Answer? </h2>
                                <AnswerQuestion
                                  id={this.props.match.params.id}
                                  updateAnswers={this.answerHandler}
                                />
                          </Well>
                        </Col>
                    </Row>
                    <div>
                    {answers}
                    </div>
                </div>
            )
        } else {
            return <h2>Loading...</h2>
        }
    }
}

function mapStateToProps(state) {
    return {
        user: state.login.user
    }
}

QuestionPage = connect(
    mapStateToProps,
)(QuestionPage);

export default QuestionPage;
