import { useMemo, useState } from "react";
import { Tag } from "./App";
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import styles from "./NoteList.module.css"

type SimplifiedNote = {
    tags: Tag[];
    title: string;
    id: string;
}

type NoteListProps = {
    notes: SimplifiedNote[];
    availableTags:Tag[];
    onUpdateTag: (id: string, label: string) => void;
    onDeleteTag: (id: string) => void;
};

type EditTagsModelProps = {
    show: boolean;
    availableTags: Tag[];
    handleClose: ()=>void;
    onDeleteTag: (id: string) => void;
    onUpdateTag: (id: string, label: string) => void;
}

const NoteList = ({ notes, availableTags, onUpdateTag, onDeleteTag}: NoteListProps) => {

    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState('');
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false);

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === '' ||
                note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.every(tag => 
                    note.tags.some(noteTag => noteTag.id === tag.id)))
            )
        })
    }, [title, selectedTags, notes])

  return (
    <>
        <Row className="align-items-centre mb-4">
            <Col>
                <h1>
                    Notes
                </h1>
            </Col>
            <Col xs='auto'>
                <Stack gap={2} direction="horizontal">
                    <Link to='/new'>
                        <Button variant="primary">Create</Button>
                    </Link>
                    <Button
                        onClick={() => setEditTagsModalIsOpen(true)}
                        variant="outline-secondary"
                    >
                        Edit Tags
                    </Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row className="mb-4">
                <Col>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="tags">
                        <Form.Label>Tags</Form.Label>
                        <ReactSelect
                            value={selectedTags.map(tag => {
                                return { label: tag.label, value: tag.id}
                            })}
                            options={availableTags.map(tag => {
                                return { label: tag.label, value: tag.id}
                            })}
                            onChange={tags => {
                                setSelectedTags(
                                    tags.map(tag => {
                                        return { label: tag.label, id: tag.value}
                                    })
                                )
                            }}
                            isMulti
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {filteredNotes.map(note => (
                <Col key={note.id}>
                    <NoteCard id={note.id} title={note.title} tags={note.tags} />
                </Col>
            ))}
        </Row>
        <EditTagModal
            onUpdateTag={onUpdateTag}
            onDeleteTag={onDeleteTag}
            show={editTagsModalIsOpen}
            handleClose={() => setEditTagsModalIsOpen(false)}
            availableTags={availableTags}
        />
    </>
  )
}

function NoteCard({ id, title, tags}: SimplifiedNote){
    return (
        <Card
            as={Link}
            to={`/${id}`}
            className={`h-100 text-reset text-decoration-none ${styles.card}`}
        >
            <Card.Body>
                <Stack
                    gap={2}
                    className="align-items-centre justify-content-centre h-100"
                >
                    <span className="fs-5">{title}</span>
                    {tags.length > 0 && (
                        <Stack
                            gap={1}
                            direction="horizontal"
                            className="justify-content-centre flex-wrap"
                        >
                            {tags.map(tag => (
                                <Badge className="text-truncate" key={tag.id}>
                                    {tag.label}
                                </Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}

function EditTagModal({ availableTags, handleClose, show, onDeleteTag, onUpdateTag}: EditTagsModelProps) {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}> 
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        value={tag.label}
                                        onChange={e => onUpdateTag(tag.id, e.target.value)}
                                    />
                                </Col>
                                <Col xs='auto'>
                                    <Button
                                        onClick={() => onDeleteTag(tag.id)}
                                    >&times;</Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default NoteList