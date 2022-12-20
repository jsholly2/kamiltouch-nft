import React from "react";
import { Container, Nav } from "react-bootstrap";
import { useContractKit } from "@celo-tools/use-contractkit";
import { Notification } from "./components/ui/Notifications";
import Wallet from "./components/Wallet";
import Cover from "./components/minter/Cover";
import Nfts from "./components/minter/nfts";
import { useBalance, useMinterContract } from "./hooks";
import coverImg from "./assets/bg_image.jpg";
import "./App.css";

const App = function AppWrapper() {
  const { address, destroy, connect } = useContractKit();
  const { balance, getBalance } = useBalance();
  const minterContract = useMinterContract();

  return (
    <>
      <Notification />
      {address ? (
        <Container fluid="md">
          <Nav className="nav justify-content-between align-item-center pt-3 pb-5">
            <Nav.Item className="px-4">
              <h1>KamilTouch</h1>
            </Nav.Item>
            <Nav.Item>
              <Wallet
                address={address}
                amount={balance.CELO}
                symbol="CELO"
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <main className="main">
            {/* <div class="painting-search">
              <input type="search" placeholder="Search" />
              <img src="https://cdn-icons-png.flaticon.com/512/54/54481.png" alt="Seacrh icon" />
            </div> */}
            <Nfts
              name="KamilTouch Artistry"
              updateBalance={getBalance}
              minterContract={minterContract}
            />
          </main>
        </Container>
      ) : (
        <Cover name="KamilTouch Artistry" coverImg={coverImg} connect={connect} />
      )}
    </>
  );
};

export default App;