import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setSearchTerm, setCurrentPage } from '../redux/productSlice';
import ProductItem from './ProductItem';
import { Button, Box, TextField, Typography } from '@mui/material';

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
    <div className="container">
      <Typography variant="h4" gutterBottom>
        Danh Sách Bán Hàng
      </Typography>

      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <AddProductButton />

      {currentItems.length === 0 ? (
        <Typography variant="body1" color="error">
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
    </div>
  );
};

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

const SearchBar = ({ searchTerm, onSearchChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
    <TextField
      label="Tìm kiếm hàng hóa..."
      variant="outlined"
      value={searchTerm}
      onChange={onSearchChange}
      fullWidth
    />
  </Box>
);

const AddProductButton = () => (
  <Link to="/add">
    <Button variant="contained" sx={{ mb: 2 }}>
      Thêm hàng hóa
    </Button>
  </Link>
);

const ProductListItems = ({ items }) => (
  <ul>
    {items.map(item => (
      <ProductItem key={item.id} item={item} />
    ))}
  </ul>
);

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
    <Button
      onClick={() => onPageChange(-1)}
      disabled={currentPage === 1}
      variant="outlined"
      sx={{ mr: 2 }}
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
      sx={{ ml: 2 }}
    >
      Trang sau
    </Button>
  </Box>
);

export default ProductList;
