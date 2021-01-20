import React, { Component } from 'react'
import axios from "axios"
import './JokesList.css'
import Joke from "./Joke";
import { v4 as uuid } from 'uuid';
class JokesList extends Component{
    static defaultProps ={
        numOfjokestoget:10
    };
    constructor(props){
        super(props)
        this.state={jokes:JSON.parse(window.localStorage.getItem("jokes"))|| [],loading:false}
        this.seenjokes=new Set(this.state.jokes.map(j=>j.text)); 
        this.handleClick=this.handleClick.bind(this)
    }
     componentDidMount(){
       
        if(this.state.jokes.length===0)this.getJokes()
        
      
    }
    async getJokes(){
        let jokes=[]
        while(jokes.length<this.props.numOfjokestoget){
            console.log("yg")
            let joke=await axios.get("https://icanhazdadjoke.com/",{
            headers:{Accept: "application/json"}
            })
            if(!(this.seenjokes.has(joke.data.joke)))
            {jokes.push({id:uuid(),text:joke.data.joke,votes:0})}
            else console("duplicate found")

        }
        // console.log(this.seenjokes);
        this.setState(
            st => ({
                loading:false,
                jokes:[...this.state.jokes,...jokes]
            }),
            ()=> window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes))//this is exected after the above statement is finished
        )
    }
    handleClick(){
        this.setState({loading:true},this.getJokes);
    }
    handleVotes(id,change){
        this.setState(
            st => ({
                jokes:st.jokes.map(j => (
                    j.id===id? {...j,votes:j.votes+change}:j
                ))
            }),
            ()=> window.localStorage.setItem("jokes",JSON.stringify(this.state.jokes))//this is exected after the above statement is finished
        )

    }
    render(){
        let jokes=this.state.jokes.sort((a,b)=> b.votes-a.votes)
        if (this.state.loading) {
            return (
              <div className='JokeList-spinner'>
                <i className='far fa-8x fa-laugh fa-spin' />
                <h1 className='JokeList-title'>Loading...</h1>
              </div>
            );
          }
        return (
            <div className="JokeList">
                <div className="JokeList-sidebar">
                    <h1 className="JokeList-title"><span> Dad</span>jokes</h1>
                    <img alt="" src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button className="JokeList-getmore" onClick={this.handleClick}> New Jokes</button>
                </div>
                
                <div className="JokeList-jokes">
                    {jokes.map(j => 
                        <Joke key={j.id} votes={j.votes} text={j.text}
                        upvote={()=>this.handleVotes(j.id,1)}
                        downvote={()=>this.handleVotes(j.id,-1)}
                        />
                         )}
                </div>
            </div>
        )
    }
}
export default JokesList