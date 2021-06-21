import Head from 'next/head'
import styled from 'styled-components';
import { useState } from 'react';

export default function Home() {
    const [userId, setUserId] = useState(':id')

    return (
        <>
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap" rel="stylesheet" />
                <title>Lanyard for GitHub Profile</title>
            </Head>

            <Background>
                <Header>
                    🏷️ lanyard-profile-readme
                </Header>
                <Container>
                    <p style={{ fontSize: "1rem", fontWeight: "bold", marginTop: "1rem" }}>Make sure you're in the <a style={{ color: "#fff" }} rel="noreferrer" href="https://discord.com/invite/WScAm7vNGF">Discord</a> for this to work.</p>
                    <Input maxLength={18} type="text" placeholder="Paste your Discord user ID here" onChange={((e) => setUserId(e.target.value))} />
                    <span style={{ fontSize: "1rem", marginTop: "1rem" }}>Copy the following and paste it into your README.md</span>
                    <Link>
                        [![Discord Presence](https://lanyard-profile-readme.vercel.app/api/{userId})](https://discord.com/users/{userId})
                    </Link>
                    <span style={{ fontSize: "1rem", fontStyle: "italic", marginTop: "1rem" }}>For further customization, check out the <a rel="noreferrer" target="_blank" href="https://github.com/cnrad/lanyard-profile-readme" style={{ color: "#fff", fontWeight: "bold" }}>repo</a>!</span>
                    <Example src={`https://lanyard-profile-readme.vercel.app/api/${userId}`} alt="[Please provide a valid user ID!]" style={{ color: "#ff8787" }} />
                </Container>
            </Background>
        </>
    )
}

const Background = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    margin: 0;
    inset: 0;
    background: url(/background.png) 60% 50%;
    background-size: cover;
    color: #fff;
    font-size: 20px;
    font-family: Poppins, sans-serif;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Header = styled.h1`
    font-size: 2rem;
    text-align: center;
    width: 100%;
    white-space: nowrap;
`

const Container = styled.div`
    min-width: 300px;
    width: 40%;
    height: auto;
    padding: 2rem;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(7px);

    text-align: center;
    border: solid 0.5px #fff;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
`

const Input = styled.input`
    margin: 10px 0 20px 0;
    width: 60%;
    border: solid 2px #ccc;
    font-size: 1.1rem;
    border-radius: 3px;
    text-align: center;
    padding: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;

    &::placeholder {
        text-align: center;
    }
`

const Link = styled.div`
    margin: 10px 0 20px 0;
    width: calc(100% - 40px);
    height: auto;
    font-size: 1.1rem;
    border: solid 1px #ccc;
    border-radius: 3px;
    padding: 5px;
    background-color: #222;

    scrollbar-width: thin;
`

const Example = styled.img`
    margin-top: 1.5rem;

    @media(max-height: 800px){
        display: none;
    }

    @media(max-width: 1000px){
        display: none;
    }
`