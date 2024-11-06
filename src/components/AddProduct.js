import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../redux/productSlice';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) {
      setError('Vui lòng nhập đủ thông tin!');
      return;
    }
    if (Number(price) <= 0) {
      setError('Giá hàng hóa phải lớn hơn 0!');
      return;
    }
    
    dispatch(addProduct({ id: Date.now(), name, price: Number(price) }));
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Thêm Hàng Hóa
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Tên hàng hóa"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Giá hàng hóa"
            variant="outlined"
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              setError('');
            }}
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
              onClick={() => navigate('/')}
              sx={{ width: '48%' }}
            >
              Quay lại
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AddProduct;