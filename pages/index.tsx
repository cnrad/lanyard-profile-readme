import Head from "next/head";
import styled, { createGlobalStyle } from "styled-components";
import { useState } from "react";

export default function Home() {
    const [userId, setUserId] = useState<null | string>(null);
    const [copyState, setCopyState] = useState("Copy");
    const copy = () => {
        navigator.clipboard.writeText(`[![Discord Presence](https://lanyard.cnrad.dev/api/${userId}
                            )](https://discord.com/users/${userId})`);
        setCopyState("Copied!");

        setTimeout(() => setCopyState("Copy"), 1500);
    };

    return (
        <>
            <GlobalStyle />
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400&display=swap"
                    rel="stylesheet"
                />
                <title>Lanyard for GitHub Profile</title>
                <meta property="og:title" content="Lanyard for GitHub Profile" key="title" />
                <meta
                    name="description"
                    content="Utilize Lanyard to display your Discord Presence in your GitHub Profile"
                />
                <meta
                    name="og:description"
                    content="Utilize Lanyard to display your Discord Presence in your GitHub Profile"
                />
            </Head>
            <Main>
                <Container>
                    <Icon>🏷️</Icon>
                    <Title>lanyard profile readme</Title>
                    <Paragraph>Utilize Lanyard to display your Discord Presence in your GitHub Profile</Paragraph>
                    <br />
                    <Input onChange={el => setUserId(el.target.value)} placeholder="Enter your Discord ID" />
                    {userId ? (
                        <>
                            <Output>
                                [![Discord Presence](https://lanyard.cnrad.dev/api/{userId}
                                )](https://discord.com/users/{userId})
                            </Output>
                            <Copy onClick={copy}>{copyState}</Copy>
                            <Example
                                src={`/api/${userId}`}
                                alt="[Please provide a valid user ID!]"
                                style={{ color: "#ff8787" }}
                            />
                        </>
                    ) : null}
                </Container>
            </Main>
        </>
    );
}

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Poppins', sans-serif;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgb(64 68 78);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(24 28 39);
  }
`;

const Main = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    max-width: 100vw;
    min-height: 100vh;
    background: url(./background.jpg) 50% no-repeat fixed;
    background-size: cover;
`;

const Container = styled.div`
    position: relative;
    backdrop-filter: blur(50px);
    background: rgb(0, 0, 0, 0.18);
    border-radius: 10px;
    margin: 50px;
    padding: 10px;
    width: 80%;
    max-width: 500px;
`;

const Icon = styled.h1`
    font-size: 2.5em;
    position: absolute;
    top: -27px;
    left: -21px;
`;

const Title = styled.h1`
    text-align: left;
    font-size: 2.25em;
    font-weight: 600;
    margin: 5px 25px;
    color: #cecece;
`;

const Paragraph = styled.p`
    padding: 0 25px;
    color: #aaabaf;
    font-size: 1.12em;
`;

const Input = styled.input`
    text-align: left;
    border-radius: 8px;
    border: none;
    width: 80%;
    max-width: 250px;
    margin: 0 25px 15px;
    font-size: 1em;
    padding: 5px 10px;
    color: #aaabaf;
    background: #191d28;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
    transition: background ease-in-out 0.2s;

    &:focus {
        outline: 0;
        background: #11151f;
    }
`;

const Output = styled.div`
    margin: 15px 25px;
    color: #aaabaf;
    word-break: break-word;
    border-radius: 8px;
    padding: 8px;
    backdrop-filter: blur(50px);
    background: rgb(0, 0, 0, 0.1);
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
`;

const Copy = styled.button`
    position: absolute;
    right: 35px;
    font-size: 0.9em;
    padding: 5px 25px;
    width: 103px;
    border-radius: 6px;
    cursor: pointer;
    border: none;
    color: #aaabaf;
    backdrop-filter: blur(50px);
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
    background: #191d28;
    transition: background ease-in-out 0.2s;

    &:hover {
        background: #11151f;
    }
    &:active {
        background: #0c0d13;
    }
`;

const Example = styled.img`
    display: block;
    margin: 70px auto 0px;
    padding: 0 20px 15px;
    width: 100%;
    filter: drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.2));
`;
