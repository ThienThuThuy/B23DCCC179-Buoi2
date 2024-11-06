import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateProduct } from '../redux/productSlice';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Lấy sản phẩm từ Redux Store
  const product = useSelector(state => state.products.items.find(item => item.id === parseInt(id)));
  
  // State quản lý form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  // Effect để set giá trị ban đầu từ sản phẩm đã chọn
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
    }
  }, [product]);

  // Hàm kiểm tra tính hợp lệ của form
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

  // Hàm xử lý gửi form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(updateProduct({ id: parseInt(id), name, price: Number(price) }));
      navigate('/');
    }
  };

  // Nếu không tìm thấy sản phẩm, hiển thị thông báo lỗi
  if (!product) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" color="error" align="center">
          Không tìm thấy sản phẩm
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Chỉnh sửa Hàng Hóa
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
              setError('');  // Xóa lỗi khi người dùng thay đổi thông tin
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
              setError('');  // Xóa lỗi khi người dùng thay đổi thông tin
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
              Lưu thay đổi
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

export default EditProduct;
