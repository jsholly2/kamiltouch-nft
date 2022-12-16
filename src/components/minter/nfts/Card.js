import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import Identicon from "../../ui/Identicon";
import { useContractKit } from "@celo-tools/use-contractkit";

const NftCard = ({ nft, buyNft, likeNft }) => {
  const {kit} = useContractKit();
  const {defaultAccount} = kit;
  const { price, image, description, owner, artistName, artName, index, category, sold, likes } = nft;

  function isOwner() {
    if(defaultAccount === owner) return true
    else return false
  }
  function footerBtn() {
    if(sold){
      if(isOwner()) {
        return <><Button variant="outline-success" disabled>Owned</Button><Button variant="outline-success" onClick={likeNft}>Like</Button></>
      }
      else if(!isOwner()) {
        return <><Button variant="danger" disabled>Sold</Button><Button variant="outline-success" onClick={likeNft}>Like</Button></>
      }
    }
    else {
      if(isOwner()) {
        return <><Button variant="outline-success" disabled>Owned</Button><Button variant="outline-success" onClick={likeNft}>Like</Button></>
      }
      else if(!isOwner()) {
        return <><Button variant="success" onClick={buyNft}>Buy {price/10**18}cUSD</Button><Button variant="outline-success" onClick={likeNft}>Like</Button></>
      }
    }
  }

  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex flex-column text-center">
          <Card.Title className="fs-3">{artName}</Card.Title>
          <Card.Text className="d-flex mb-2 justify-content-center gap-3 flex-grow-1 text-capitalize">
            <span>artist: {artistName} </span>
            <span>category: {category}</span>
          </Card.Text>
          <Card.Text className="d-flex mb-2 flex-column justify-content-center gap-2 flex-grow-1 text-capitalize">
            <span>{description}</span>
            <span>Likes: {likes}</span>
          </Card.Text>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-center gap-3">
          {footerBtn()}
        </Card.Footer>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;