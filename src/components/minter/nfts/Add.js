import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { uploadFileToWebStorage } from "../../../utils/minter";


const AddNfts = ({ save, address }) => {
  const [artName, setArtName] = useState("");
  const [ipfsImage, setIpfsImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [artistName, setArtistName] = useState("");
  const [price, setPrice] = useState("");
  const [show, setShow] = useState(false);

  const isFormFilled = () =>
  artName && ipfsImage && description && category && artistName && price;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
    setCategory([]);
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="success"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Art NFT</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Art Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of Art"
                onChange={(e) => {
                  setArtName(e.target.value);
                }}
              />
            </FloatingLabel>

            
            <FloatingLabel
              controlId="inputLocation"
              label="Artist Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of Artist"
                onChange={(e) => {
                  setArtistName(e.target.value);
                }}
              />
            </FloatingLabel>

            <select
              className="form-select my-3 py-3"
              onClick={(e)=> {
                setCategory(e.target.value)
              }}
            >
              <option>Category</option>
              <option value="Nature">Nature</option>
              <option value="Abstract">Abstract</option>
              <option value="Real">Real</option>
              <option value="Cosmic">Cosmic</option>
              <option value="Portrait">Portrait</option>
            </select>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadFileToWebStorage(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setIpfsImage(imageUrl);
              }}
              placeholder="Art image"
            ></Form.Control>

            
            <FloatingLabel
              controlId="inputLocation"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Price of Art"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save({
                artName,
                artistName,
                ipfsImage,
                description,
                ownerAddress: address,
                category,
                price,
              });
              handleClose();
            }}
          >
            Create NFT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddNfts.propTypes = {
  save: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired,
};

export default AddNfts;