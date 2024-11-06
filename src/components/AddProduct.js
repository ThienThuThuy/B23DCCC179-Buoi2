import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchTerm, setCurrentPage, addProduct } from '../redux/productSlice';
import ProductItem from './ProductItem';
import { Button, Box, TextField, Typography, Grid, Paper, Modal, Alert, Container } from '@mui/material';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, searchTerm, currentPage, itemsPerPage } = useSelector(state => state.products);

  const filteredItems = getFilteredItems(items, searchTerm);
  const { currentItems, totalPages } = getPaginatedItems(filteredItems, currentPage, itemsPerPage);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (direction) => {
    dispatch(setCurrentPage(currentPage + direction));
  };

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setError('');
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    setError('');
  };

  const validateForm = () => {
    if (!name || !price) {
      setError('Vui lòng nhập đủ thông tin!');
      return false;
    }
    if (Number(price) <= 0) {
      setError('Giá hàng hóa phải lớn hơn 0!');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(addProduct({ id: Date.now(), name, price: Number(price) }));
      setName('');
      setPrice('');
      handleModalClose();
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        Danh Sách Bán Hàng
      </Typography>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            label="Tìm kiếm hàng hóa..."
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleModalShow}>
            Thêm hàng hóa
          </Button>
        </Box>
      </Paper>

      {currentItems.length === 0 ? (
        <Typography variant="body1" color="error" textAlign="center">
          Không tìm thấy hàng hóa nào!
        </Typography>
      ) : (
        <ProductListItems items={currentItems} />
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <AddProductModal
        show={showModal}
        handleClose={handleModalClose}
        name={name}
        price={price}
        handleNameChange={handleNameChange}
        handlePriceChange={handlePriceChange}
        handleSubmit={handleSubmit}
        error={error}
      />
    </Box>
  );
};

// Filtering and Pagination
const getFilteredItems = (items, searchTerm) => {
  return items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const getPaginatedItems = (filteredItems, currentPage, itemsPerPage) => {
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  return { currentItems, totalPages };
};

// Product Items List and Pagination Controls
const ProductListItems = ({ items }) => (
  <Grid container spacing={2}>
    {items.map(item => (
      <Grid item xs={12} sm={6} key={item.id}>
        <ProductItem item={item} />
      </Grid>
    ))}
  </Grid>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
    <Button
      onClick={() => onPageChange(-1)}
      disabled={currentPage === 1}
      variant="outlined"
    >
      Trang trước
    </Button>
    <Typography variant="body1">
      Trang {currentPage} / {totalPages}
    </Typography>
    <Button
      onClick={() => onPageChange(1)}
      disabled={currentPage === totalPages}
      variant="outlined"
    >
      Trang sau
    </Button>
  </Box>
);

// Modal component for adding a product
const AddProductModal = ({
  show,
  handleClose,
  name,
  price,
  handleNameChange,
  handlePriceChange,
  handleSubmit,
  error
}) => (
  <Modal open={show} onClose={handleClose}>
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: 3,
      boxShadow: 24,
      minWidth: '300px',
    }}>
      <Typography variant="h6" gutterBottom>
        Thêm Hàng Hóa
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tên hàng hóa"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Giá hàng hóa"
          variant="outlined"
          type="number"
          value={price}
          onChange={handlePriceChange}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ width: '48%' }}
          >
            Thêm hàng hóa
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClose}
            sx={{ width: '48%' }}
          >
            Đóng
          </Button>
        </Box>
      </form>
    </Box>
  </Modal>
);

export default ProductList;
