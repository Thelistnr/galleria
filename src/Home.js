import { Link } from "react-router-dom";
import data from "./data";
import { useContext, useState } from "react";
import { logInContext } from "./App";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { database } from "./firebase";


const SortableData = ({img}) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: img.id});
    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        margin:'5px', overflow:'hidden', borderRadius:'20px', maxWidth:'500px', display:'grid', cursor:'pointer'
    };
    return (
        
        <div className="tag" style={style} ref={setNodeRef} {...attributes} {...listeners} key={img.id}><img src={img.image} alt=""/><button className="div" style={{position:'absolute', margin:'5px 10px', padding:'5px', borderRadius:'10px', width:'80px', fontWeight:'600', cursor:'pointer', backgroundColor:'#0466f2'}}>{img.tag.toUpperCase()}</button></div>
    )
}

const Home = () => {
    const [input, setInput] = useState('');
    const [pop, setPop] = useState(false);
    const [sign, setSign] = useState(false);
    const [sig, setSig] = useState(true);
    const [items, setItems] = useState(data)
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useContext(logInContext);

    const handleChange = (e) => {
        setInput(e.target.value) 
    }

    const onDragEnd = event => {
        const{active, over} = event
        if(active.id === over.id){
            return;
        }
        setItems((items) => {
            const oldIndex = items.findIndex((img) => img.id === active.id);
            const newIndex = items.findIndex((img) => img.id === over.id);
            return arrayMove(items, oldIndex, newIndex);
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(database, email, password)
            .then((data) => {
                localStorage.setItem('accessToken', data._tokenResponse.idToken)
                setLoggedIn(true)
                setPop(false)
                alert('log-in successfull')
                
            })
            .catch((err) => {
                alert(err.code)
            })
    }

    const handleSignSubmit = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(database, email, password)
            .then((data) => {
                localStorage.setItem('accessToken', data._tokenResponse.idToken)
                setLoggedIn(true)
                setPop(false)
                alert('Sign-up successfull')
                setSign(false)
                setSig(true)
            })
            .catch((err) => {
                alert(err.code)
            })
    }

    return ( 
        <div className="home" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <div className="nav" style={{display:'flex', top:'0', width:'100%', padding:'10px 0', borderBottom:'1px solid #F3F3F3'}}>
                <div className="navWrap"style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
                    <Link to='/' style={{textDecoration:'none', fontSize:'300%', fontWeight:'800', color:'#0466f2'}}>Galleria</Link>
                    <input 
                        type="text" 
                        className="inp"
                        placeholder="Enter your text"
                        style={{width:'80%', border:'1px solid gray', outline:'0', backgroundColor:'EDEDED', padding:'10px', borderRadius:'10px', margin:'0 10px'}}
                        value={input}
                        onChange={handleChange}
                    />
                    {!loggedIn && <button className="login" style={{padding:'10px', borderRadius:'10px', width:'130px', border:'0', cursor:'pointer', backgroundColor:'#0466f2'}} onClick={e => {setPop(true)}}>Sign-Up/Log-In</button>}
                    {loggedIn && <button className="logout" style={{padding:'10px', borderRadius:'10px', width:'70px', border:'0', cursor:'pointer', backgroundColor:'#0466f2'}} onClick={e => {setLoggedIn(false); localStorage.clear();}}>Log-Out</button>}
                </div>
                {pop && <div className="pop" style={{position:'fixed', top:'0', bottom:'0', left:'0', right:'0', display:'flex', justifyContent:'center', alignItems:'center', zIndex:'100'}}>
                    <div className="bg" style={{backgroundColor:'rgba(0, 0, 0, 0.5)', position:'fixed', top:'0', bottom:'0', left:'0', right:'0'}} onClick={e => {setPop(false)}}></div>
                    {sig && <div className="popWrap" style={{zIndex:'101'}}>
                        <form onSubmit={handleSubmit} className="form">
                            <h2>Log in</h2>
                            <div className="formWrap">
                                <div className="field">
                                    <div className="mail">
                                        <label/>
                                        <input type="mail" placeholder="Email" required
                                            className="inpt"
                                            value={email}
                                            onChange={(e) => {setEmail(e.target.value)}}
                                        />
                                    </div>
                                    <div className="password">
                                        <label/>
                                        <input type="password" placeholder="Password" required
                                            className="inpt"
                                            value={password}
                                            onChange={(e) => {setPassword(e.target.value)}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button style={{cursor:'pointer'}}>Continue</button>
                            {/* <button disabled style={{backgroundColor: 'gray'}}>Logging in</button> */}
                            <div className="container" style={{backgroundColor:'white', padding:'0', textAlign:'center', borderRadius:'10px', marginTop:'0'}}>
                                <p style={{display:'flex', justifyContent:'center'}}>Not Signed up yet? <div style={{textDecoration:'none', color:'#0466f2', padding:'0 0 0 2px', margin:'0', fontSize:'medium', cursor:'pointer'}} onClick={e => {setSign(true); setSig(false)}}> Sign-Up</div></p>
                            </div>
                        </form>
                    </div>}
                    {sign && <div className="popWrap" style={{zIndex:'101'}}>
                        <form onSubmit={handleSignSubmit} className="form">
                            <h2>Sign up</h2>
                            <div className="formWrap">
                                <div className="field">
                                    <div className="mail">
                                        <label/>
                                        <input type="mail" placeholder="Email" required
                                            className="inpt"
                                            value={email}
                                            onChange={(e) => {setEmail(e.target.value)}}
                                        />
                                    </div>
                                    <div className="password">
                                        <label/>
                                        <input type="password" placeholder="Password" required
                                            className="inpt"
                                            value={password}
                                            onChange={(e) => {setPassword(e.target.value)}}
                                        />
                                    </div>
                                </div>
                            </div>
                            <button style={{cursor:'pointer'}}>Continue</button>
                            {/* <button disabled style={{backgroundColor: 'gray'}}>Logging in</button> */}
                            <div className="container" style={{backgroundColor:'white', padding:'0', textAlign:'center', borderRadius:'10px', marginTop:'0'}}>
                                <p style={{display:'flex', justifyContent:'center'}}>Signed up already? <div style={{textDecoration:'none', color:'#0466f2', padding:'0 0 0 2px', margin:'0', fontSize:'medium', cursor:'pointer'}} onClick={e => {setSig(true); setSign(false)}}> Log-In</div></p>
                            </div>
                        </form>
                    </div>}
                </div>}
            </div>
            {loggedIn && <div className="wrap" style={{display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={data} strategy={horizontalListSortingStrategy}>
                        {items.filter((item) => {return input.toLowerCase() === '' ? item : item.tag.toLowerCase().includes(input.toLowerCase()); }).map((img) => (
                            <SortableData key={img.id} img={img}/>
                        ))}
                    </SortableContext>
                </DndContext>
            </div>}
            {!loggedIn && <div className="wrap" style={{display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                {items.filter((item) => {return input.toLowerCase() === '' ? item : item.tag.toLowerCase().includes(input.toLowerCase()); }).map((img) => (
                    <div className="tag" style={{margin:'5px', overflow:'hidden', borderRadius:'20px', maxWidth:'500px', display:'grid', cursor:'pointer'}} key={img.id}><img src={img.image} alt="" onDrag={e => {setPop(true)}}/><button className="div" style={{position:'absolute', margin:'5px 10px', padding:'5px', borderRadius:'10px', width:'80px', fontWeight:'600', cursor:'pointer'}}>{img.tag.toUpperCase()}</button></div>
                ))}
            </div>}
            {/* {items && <div className="wrap" style={{display:'flex', justifyContent:'center', alignItems:'center', flexWrap:'wrap'}}>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
                <div style={{margin:'5px', overflow:'hidden', borderRadius:'20px', display:'grid', cursor:'pointer', backgroundColor:'gray'}}></div>
            </div>} */}
        </div>
     );
}

 
export default Home;