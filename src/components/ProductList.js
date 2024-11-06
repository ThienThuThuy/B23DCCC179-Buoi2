import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSearchTerm, setCurrentPage } from '../redux/productSlice';
import ProductItem from './ProductItem';
import { Button, Box, TextField, Typography, Grid, Paper } from '@mui/material';

const ProductList = () => {
  const dispatch = useDispatch();
  const { items, searchTerm, currentPage, itemsPerPage } = useSelector(state => state.products);

  const filteredItems = getFilteredItems(items, searchTerm);
  const { currentItems, totalPages } = getPaginatedItems(filteredItems, currentPage, itemsPerPage);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePageChange = (direction) => {
    dispatch(setCurrentPage(currentPage + direction));
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
          <Link to="/add">
            <Button variant="contained" color="primary">
              Thêm hàng hóa
            </Button>
          </Link>
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
  <Grid spacing={2}>
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

export default ProductList;
