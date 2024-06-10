import React, { useEffect, useState } from 'react'
import ListData from '../components/ListData'
import axios from 'axios';

function Admin() {
    const [invalidData, setInvalidData] = useState(0);

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        const formData = {
            nis: document.getElementById('nis').value,
            nama: document.getElementById('nama').value,
            jurusan: document.getElementById('jurusan').value,
            alamat: document.getElementById('alamat').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value
        };
    
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL, formData);
            setRows([...rows, response.data]);
            ['nis', 'nama', 'jurusan', 'alamat', 'email', 'phone'].forEach(id => document.getElementById(id).value = '');
            document.getElementById('modalAddButton').click();
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const [rows, setRows] = useState([])

    const fetchData = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API_URL);
            setRows(response.data);
            setInvalidData(response.data.filter(row => /\D/.test(row.nis) || row.nis.length < 9).length);
        } catch (err) {
            console.log(err);
        }
    }
    
    const [showDates, setShowDates] = useState(false);

    const toggleDatesVisibility = () => {
        setShowDates(!showDates);
    };

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="w-100 vh-100 pt-lg-5">
            <div className='d-flex justify-content-between w-100'>
                <div>
                    <h1>List data siswa</h1>
                    {invalidData > 0 && <p className='text-danger'>{invalidData} data tidak valid</p>}
                </div>
                <div>
                    <button type="button" className="btn btn-success btn-sm py-2 me-2" id='modalAddButton' data-bs-toggle="modal" data-bs-target="#addDataModal">
                        Tambah Data
                    </button>
                    <button onClick={toggleDatesVisibility} className="btn btn-primary btn-sm py-2">Lihat Tanggal</button>
                </div>
            </div>

            <div className='mt-2'>
                <ListData data={rows} showDates={showDates} refresh={fetchData}></ListData>
            </div>

            <div className="modal fade" id="addDataModal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content myModal">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">Add Data</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={(e) => handleSubmitAdd(e)}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="nis" className="form-label">NIS</label>
                                    <input required type="text" className="form-control" id="nis" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="nama" className="form-label">Nama</label>
                                    <input required type="text" className="form-control" id="nama" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="jurusan" className="form-label">Jurusan</label>
                                    <input required type="text" className="form-control" id="jurusan" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="alamat" className="form-label">Alamat</label>
                                    <input required type="text" className="form-control" id="alamat" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input required type="email" className="form-control" id="email" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone</label>
                                    <input required type="text" className="form-control" id="phone" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


            
        </div>
    )
}

export default Admin
