import Head from "next/head";
import styled, { createGlobalStyle } from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSmoothCount } from "use-smooth-count";

export default function Home({ userCount }: { userCount: number }) {
    const [userId, setUserId] = useState<null | string>(null);
    const [userError, setUserError] = useState<string>();
    const [copyState, setCopyState] = useState("Copy");

    const countRef = useRef<HTMLDivElement | null>(null);
    const counter = useSmoothCount({ ref: countRef, target: userCount, duration: 3, curve: [0, 1, 0, 1] });

    const copy = () => {
        navigator.clipboard.writeText(
            `[![Discord Presence](https://lanyard.cnrad.dev/api/${userId})](https://discord.com/users/${userId})`
        );
        setCopyState("Copied!");

        setTimeout(() => setCopyState("Copy"), 1500);
    };

    useEffect(() => {
        (async () => {
            try {
                await axios.get(`/api/${userId}`);
                setUserError(undefined);
            } catch (error: any) {
                console.log(error.response);
                if (error.response.status === 404 && error.response.data.code == "user_not_monitored")
                    setUserError(`User not monitored by Lanyard, click to join the discord`);
            }
        })();
    }, [userId]);

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
                    <Title>lanyard profile readme 🏷️</Title>
                    <Paragraph>Utilize Lanyard to display your Discord Presence in your GitHub Profile</Paragraph>
                    <br />
                    <Input onChange={el => setUserId(el.target.value)} placeholder="Enter your Discord ID" />
                    {userId ? (
                        <>
                            <Output>
                                [![Discord Presence](https://lanyard.cnrad.dev/api/{userId}
                                )](https://discord.com/users/{userId})
                            </Output>
                            <ActionButton onClick={copy}>{copyState}</ActionButton>
                            <a
                                href="https://github.com/cnrad/lanyard-profile-readme#options"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ActionButton>Options</ActionButton>
                            </a>
                            <a
                                style={{ textDecoration: "none" }}
                                target="_blank"
                                href={userError && "https://discord.gg/lanyard"}
                                rel="noreferrer"
                            >
                                <Example
                                    src={`/api/${userId}`}
                                    alt={`${userError || "Please provide a valid user ID!"}`}
                                    style={{ color: "#ff8787" }}
                                />
                            </a>
                        </>
                    ) : null}
                </Container>
            </Main>
            <FooterStat>
                Lanyard Profile Readme has <div style={{ fontWeight: "bold", width: "2.75rem" }} ref={countRef} /> total
                users!
            </FooterStat>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    let userCount = await axios
        .get("https://lanyard.cnrad.dev/api/getUserCount", { timeout: 1000 })
        .then(res => res.data.count)
        .catch(() => 1000);

    return {
        props: { userCount },
    };
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
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    max-width: 100vw;
    min-height: 100vh;
    background: #010103;
    background-size: cover;
`;

const Container = styled.div`
    border-radius: 7px;
    margin-top: 60px;
    width: 80%;
    max-width: 450px;
`;

const Title = styled.h1`
    text-align: left;
    font-size: 2rem;
    font-weight: 600;
    margin: 5px 0;
    color: #cecece;
`;

const Paragraph = styled.p`
    color: #aaabaf;
    font-size: 1rem;
`;

const Input = styled.input`
    text-align: left;
    border-radius: 8px;
    border: none;
    width: 100%;
    font-size: 0.9rem;
    padding: 5px 10px;
    color: #aaabaf;
    border: solid 1px #333;
    background: #000;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
    transition: all ease-in-out 0.2s;

    &:focus {
        outline: 0;
        border-color: #ccc;
    }
`;

const Output = styled.div`
    margin: 15px 0;
    color: #aaabaf;
    word-break: break-word;
    border-radius: 8px;
    border: solid 1px #333;
    padding: 8px;
    background: #000;
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
    font-family: Monospace, sans-serif;
`;

const ActionButton = styled.button`
    font-size: 0.9rem;
    padding: 5px 25px;
    margin-right: 10px;
    border-radius: 6px;
    cursor: pointer;
    color: #888;
    border: solid 1px #333;
    background: transparent;
    transition: all ease-in-out 0.1s;

    &:hover {
        color: #e6e6e6;
        border-color: #e6e6e6;
    }
    &:active {
        color: #fff;
        border-color: #fff;
    }
`;

const Example = styled.img`
    display: block;
    margin: 30px auto 0px;
    max-width: 100%;
`;

const FooterStat = styled.div`
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    line-height: 1rem;
    bottom: 1rem;
    left: 50%;
    transform: translate(-50%, 0);
    background: #000;
    padding: 1rem 1.25rem;
    color: #fff;
    border-radius: 0.5rem;
    text-align: center;
    box-shadow: 0 2px 15px -10px #a21caf;
    min-width: 400px;

    @media (max-width: 400px) {
        font-size: 14px;
        min-width: 365px;
        padding: 0.75rem 1rem;
    }

    &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0.35rem;
        border: 2px solid transparent;
        background: linear-gradient(45deg, #be123c, #6b21a8, #3730a3) border-box;
        -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
    }
`;
