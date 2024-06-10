import React, { useEffect, useState } from 'react'
import { Table, Modal, Button } from 'react-bootstrap'
import Bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';
import axios from 'axios'

function ListData({ data, showDates, refresh }) {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [editModalState, setEditModalState] = useState(false);
    const [editingID, setEditingID] = useState(null);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);


    const prettyDate = (date) => {
        return new Date(date).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' })
    }
    const numberFormat = (number) => {
        return number.replace(/^0/, '62')
    }
    const nisValidation = (nis) => {
        // cek apakah nis mengandung karakter selain angka atau panjang karakter tidak sama dengan 9
        if (/\D/.test(nis) || nis.length < 9) {
            return 'text-danger'
        }
    }
    function capitalize(str) {
        return str.replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
    }

    const onCloseEditModal = () => {
        setEditModalState(false);
        setEditingID(null);
        ['nis', 'nama', 'jurusan', 'alamat', 'email', 'phone'].forEach(id => document.getElementById(id).value = '');
    }

    const openEditModal = (id) => {
        setEditModalState(true);
        setEditingID(id);
        axios.get(`${process.env.REACT_APP_API_URL}/${id}`)
            .then((response) => {
                document.getElementById('edit_nis').value = response.data.nis;
                document.getElementById('edit_nama').value = response.data.nama;
                document.getElementById('edit_jurusan').value = response.data.jurusan;
                document.getElementById('edit_alamat').value = response.data.alamat;
                document.getElementById('edit_email').value = response.data.email;
                document.getElementById('edit_phone').value = response.data.phone;
            }).catch((err) => {
                console.log(err);
            });
    }

    const handleEdit = () => {
        const id = editingID;
        if (!id) return console.error('ID not found');
        const formData = {
            nis: document.getElementById('edit_nis').value,
            nama: document.getElementById('edit_nama').value,
            jurusan: document.getElementById('edit_jurusan').value,
            alamat: document.getElementById('edit_alamat').value,
            email: document.getElementById('edit_email').value,
            phone: document.getElementById('edit_phone').value
        };
        axios.put(`${process.env.REACT_APP_API_URL}/${id}`, formData)
            .then(() => {
                refresh();
            })
        onCloseEditModal();
    }

    const handleDelete = (id) => {
        axios.delete(`${process.env.REACT_APP_API_URL}/${id}`)
            .then(() => {
                refresh();
            })
        setShowConfirmModal(false);
    };

    useEffect(() => {
        var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
        dropdownElementList.map(function (dropdownToggleEl) {
            return new Bootstrap.Dropdown(dropdownToggleEl);
        });
    }, [data]);
    return (
        <>
            <Table bordered hover responsive striped>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>NIS</th>
                        <th>Nama</th>
                        <th>Jurusan</th>
                        <th>Alamat</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th className={showDates ? 'd-table-cell' : 'd-none'}>Created At</th>
                        <th className={showDates ? 'd-table-cell' : 'd-none'}>Updated At</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentRows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td className={nisValidation(row.nis)}>{row.nis}</td>
                                <td>{capitalize(row.nama)}</td>
                                <td>{row.jurusan.toUpperCase()}</td>
                                <td>
                                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(row.alamat)}`} target="_blank" rel="noopener noreferrer" className='no-dec'>{row.alamat}</a>
                                </td>
                                <td><a href={`mailto:${row.email}`} className='no-dec'>{row.email}</a></td>
                                <td>
                                    <div className='text-nowrap'>
                                        {row.phone}
                                        <i className="ms-2 dropdown-toggle" type="button" id={`dropdownMenuButton${row.id}`} data-bs-toggle="dropdown" aria-expanded="false" />
                                        <ul className="dropdown-menu dropdownUl" aria-labelledby={`dropdownMenuButton${row.id}`}>
                                            <li onClick={() => { window.open(`https://wa.me/${numberFormat(row.phone)}`, '_blank') }} key={`dropdownItem-${row.id}`} className='dropdownLi d-flex justify-content-between'>
                                                <span className='no-dec-2'>Whatsapp</span>
                                                <div className='dLiIcon'>
                                                    <i className='bi bi-caret-right-fill'></i>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                                <td className={showDates ? 'd-table-cell' : 'd-none'}>{prettyDate(row.createdAt)}</td>
                                <td className={showDates ? 'd-table-cell' : 'd-none'}>{prettyDate(row.updatedAt)}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-1"
                                        onClick={() => { openEditModal(row.id) }}>Edit</button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => { setSelectedItemId(row.id); setShowConfirmModal(true); }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table>
            <div className='d-flex justify-content-end'>
                <div style={{ 'max-width': '150px' }}>
                    <select className="form-select form-select-sm h-100" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <button className="btn btn-primary mx-2 px-3" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
                <button className="btn btn-primary px-3" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(data.length / rowsPerPage)}>Next</button>
            </div>

            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Konfirmasi hapus ID: {selectedItemId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Hapus item ini?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Batal
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedItemId)}>
                        Hapus
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={editModalState} onHide={() => onCloseEditModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data</Modal.Title>
                </Modal.Header>
                <form onSubmit={() => handleEdit(editingID)}>
                    <Modal.Body>
                        <div className="mb-3">
                            <label htmlFor="nis" className="form-label">NIS</label>
                            <input required type="text" className="form-control" id="edit_nis" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nama" className="form-label">Nama</label>
                            <input required type="text" className="form-control" id="edit_nama" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="jurusan" className="form-label">Jurusan</label>
                            <input required type="text" className="form-control" id="edit_jurusan" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="alamat" className="form-label">Alamat</label>
                            <input required type="text" className="form-control" id="edit_alamat" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input required type="email" className="form-control" id="edit_email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input required type="text" className="form-control" id="edit_phone" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => onCloseEditModal()}>
                            Batal
                        </Button>
                        <Button variant="primary" type='submit'>
                            Simpan
                        </Button>
                    </Modal.Footer>
                </form >
            </Modal>
        </>
    )
}

export default ListData
