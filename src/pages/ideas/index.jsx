import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import ClickDropdownMenu from 'src/components/dropdown_click';
import { CheckBox, CloudUpload } from '@mui/icons-material';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';
import FormDialog from 'src/components/popup';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAppDispatch, useAppSelector } from 'src/redux/hook';
import { fetchAllShops } from 'src/redux/reducers/products';
import { useTranslation } from 'react-i18next';
import { tokens } from 'src/locales/tokens';

// MOCK DATA
const ideasMock = [
  {
    id: 1,
    title: 'Idea 1',
    category: 'Draft',
    description: 'An early concept for brainstorming.',
    imageUrl: '/logo.png',
  },
  { id: 2, title: 'Idea 2', category: 'New', description: 'Freshly proposed feature idea.', imageUrl: '/logo.png' },
  { id: 3, title: 'Idea 3', category: 'Todo', description: 'Queued for next sprint.', imageUrl: '/logo.png' },
  { id: 4, title: 'Idea 4', category: 'Todo', description: 'Needs breakdown and estimation.', imageUrl: '/logo.png' },
  { id: 5, title: 'Idea 5', category: 'Doing', description: 'Currently being implemented.', imageUrl: '/logo.png' },
  { id: 6, title: 'Idea 6', category: 'New', description: 'Suggested by client.', imageUrl: '/logo.png' },
  { id: 7, title: 'Idea 7', category: 'New', description: 'Based on competitor research.', imageUrl: '/logo.png' },
  { id: 8, title: 'Idea 8', category: 'Doing', description: 'Assigned to frontend team.', imageUrl: '/logo.png' },
  { id: 9, title: 'Idea 9', category: 'Done', description: 'Released in version 2.0.', imageUrl: '/logo.png' },
  { id: 10, title: 'Idea 10', category: 'Check', description: 'Waiting for internal QA.', imageUrl: '/logo.png' },
  { id: 11, title: 'Idea 11', category: 'Todo', description: 'Planned for Q3.', imageUrl: '/logo.png' },
  { id: 12, title: 'Idea 12', category: 'Todo', description: 'Backlogged due to priority.', imageUrl: '/logo.png' },
  {
    id: 13,
    title: 'Idea 13',
    category: 'Check',
    description: 'Needs verification after bug fix.',
    imageUrl: '/logo.png',
  },
  { id: 14, title: 'Idea 14', category: 'In Review', description: 'Being reviewed by PM.', imageUrl: '/logo.png' },
  { id: 15, title: 'Idea 15', category: 'In Review', description: 'Awaiting approval.', imageUrl: '/logo.png' },
  { id: 16, title: 'Idea 16', category: 'Need Fix', description: 'Requires refactoring.', imageUrl: '/logo.png' },
  { id: 17, title: 'Idea 17', category: 'Need Fix', description: 'Returned by QA.', imageUrl: '/logo.png' },
  { id: 18, title: 'Idea 18', category: 'Done', description: 'Approved and merged.', imageUrl: '/logo.png' },
  { id: 19, title: 'Idea 19', category: 'Archived', description: 'Not relevant anymore.', imageUrl: '/logo.png' },
  { id: 20, title: 'Idea 20', category: 'Archived', description: 'Deprecated feature idea.', imageUrl: '/logo.png' },
];

const fields = [
  { name: 'title', label: 'Title', fullWidth: true, required: true },
  {
    name: 'product_types',
    label: 'Product Types',
    type: 'select',
    multiple: true,
    options: [
      { label: 'T-shirt', value: 'T-shirt' },
      { label: 'Shirt', value: 'shirt' },
      { label: 'Sweater', value: 'sweater' },
    ],
  },
  {
    name: 'design_type',
    label: 'Default Design Type',
    type: 'select',
    options: [
      { label: 'Clone', value: 'Clone' },
      { label: 'Redesign', value: 'Redesign' },
      { label: 'New', value: 'New' },
    ],
  },
];

const categoryList = ['Draft', 'New', 'Todo', 'Doing', 'Check', 'In Review', 'Need Fix', 'Done', 'Archived', 'All'];

const categoryColors = {
  Draft: '#90caf9',
  New: '#a5d6a7',
  Todo: '#ffcc80',
  Doing: '#ffab91',
  Check: '#ce93d8',
  'In Review': '#80cbc4',
  'Need Fix': '#f48fb1',
  Done: '#b39ddb',
  Archived: '#721387',
  All: '#i66sd5',
};

// UTILS
const getCategoryCounts = (ideas) => {
  return categoryList.map((label) => ({
    label,
    count: label === 'All' ? ideas.length : ideas.filter((i) => i.category === label).length,
  }));
};

const getMockIdeasForBoard = (boardId) => {
  const boards = [
    { id: 1, title: 'Board 1' },
    { id: 2, title: 'Board 2' },
    { id: 3, title: 'Board 3' },
  ];
  const itemsPerBoard = 6;

  if (boardId === null) {
    return [];
  }

  const index = boards.findIndex((b) => b.id === boardId);
  if (index === -1) {
    const start = Math.floor(Math.random() * (ideasMock.length - itemsPerBoard));
    return ideasMock.slice(start, start + itemsPerBoard);
  }

  const startIndex = index * itemsPerBoard;
  return ideasMock.slice(startIndex, startIndex + itemsPerBoard);
};

// MAIN PAGE
const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [boardId, setBoardId] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading, products = [], error } = useAppSelector((state) => state.products);

  const [selectedTab, setSelectedTab] = useState(0);
  const categories = getCategoryCounts(ideas);
  const [quickDesignData, setQuickDesignData] = useState({});

  const selectedCategory = categories[selectedTab].label;
  const filteredIdeas = selectedCategory === 'All' ? ideas : ideas.filter((i) => i.category === selectedCategory);

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log('Files selected:', files);
  };

  const handleBoardChange = (newBoardId) => {
    setBoardId(newBoardId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_board_id', String(newBoardId ?? 'null'));
    }
  };

  // Lấy board từ localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('current_board_id');
      if (savedId) {
        setBoardId(savedId === 'null' ? null : savedId);
      }
    }
  }, []);

  useEffect(() => {
    if (boardId === null) {
      const mockIdeas = getMockIdeasForBoard(null);
      setIdeas(mockIdeas);
      return;
    }

    const key = `ideas_board_${boardId}`;
    let stored = localStorage.getItem(key);

    if (!stored) {
      const mockIdeas = getMockIdeasForBoard(boardId);
      localStorage.setItem(key, JSON.stringify(mockIdeas));
      stored = JSON.stringify(mockIdeas);
    }

    setIdeas(JSON.parse(stored));
  }, [boardId]);

  const handleSelect = (opt) => {
    alert(`Select: ${opt.label}`);
  };

  useEffect(() => {
    dispatch(fetchAllShops({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    const info = Object.values(products).find((item) => item.BoardId === boardId);
    setQuickDesignData(info);
  }, [products, boardId]);

  const handleSubmit = async (formData, onAfterSubmit) => {
    const { id, ...payload } = formData;

    try {
      if (id) {
        const res = await axios.put(`https://6848f91945f4c0f5ee6f902e.mockapi.io/api/v1/free/${id}`, payload);
        console.log('Updated successfully:', res.data);
        onAfterSubmit?.(res.data);
      } else {
        const res = await axios.post(`https://6848f91945f4c0f5ee6f902e.mockapi.io/api/v1/free`, payload);
        console.log('Created successfully:', res.data);
        onAfterSubmit?.(res.data);
      }
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <>
      <Seo title="Ideas" />
      <Header
        onBoardChange={handleBoardChange}
        showBoards={true}
        quickDesignData={quickDesignData}
        setQuickDesignData={setQuickDesignData}
        fields={fields}
        currentBoardId={boardId}
      />
      <Toolbar />

      <Box sx={{ display: 'flex' }}>
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: 2,
          }}
        >
          <Box>
            <Card>
              <CardContent>
                <Grid
                  xs={12}
                  sm={6}
                  md={3}
                  size={12}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}
                >
                  <Grid width={'15%'} size={4} padding={0} display={'flex'}>
                    <FormDialog
                      buttonLabel={t(tokens.nav.addnew)}
                      title="Create New Idea"
                      fields={[
                        { name: 'title', label: 'Title' },
                        { name: 'description', label: 'Description', multiline: true, rows: 4 },
                        // Thêm các field bạn muốn trong form
                      ]}
                      onSubmit={(data) => console.log(data)}
                      buttonProps={{
                        sx: { borderTopRightRadius: 0, borderBottomRightRadius: 0, m: 0 },
                        variant: 'contained',
                        color: 'primary',
                        size: 'medium',
                      }}
                    />
                    <ClickDropdownMenu
                      buttonLabel={<MoreVertIcon />}
                      options={[
                        { label: 'Import From CSV', value: 'import_csv' },
                        { label: 'Import From Folder', value: 'import_folder' },
                      ]}
                      onSelect={handleSelect}
                      buttonProps={{
                        variant: 'contained',
                        sx: {
                          padding: '8px 16px',
                          backgroundColor: 'primary.main',
                          color: 'white',
                          borderRadius: 0,
                          borderTopRightRadius: 12,
                          borderBottomRightRadius: 12,
                          minWidth: 0,
                        },
                      }}
                    />
                  </Grid>

                  <Grid
                    size={8}
                    position="static"
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                      width: '85%',
                      backgroundColor: '#fff',
                    }}
                  >
                    <TextField
                      variant="outlined"
                      InputProps={{
                        style: {
                          color: '#000',
                        },
                      }}
                      placeholder={t(tokens.nav.search)}
                      sx={{
                        '& .MuiInputBase-input::placeholder': {
                          color: '#000',
                          opacity: 1,
                        },
                        marginRight: 2,
                        padding: 0,
                        flexGrow: 1,
                      }}
                    />
                    <Button variant="contained">{t(tokens.nav.more_filter)}</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs
                value={selectedTab}
                onChange={(e, v) => setSelectedTab(v)}
                sx={{ mt: 2 }}
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {categories.map((category, idx) => (
                  <Tab
                    key={idx}
                    label={`${category.label} ${category.count}`}
                    sx={{
                      color: categoryColors[category.label],
                      borderRadius: 1,
                      mx: 0.5,
                      minHeight: '36px',
                      padding: 1,
                      fontWeight: 500,
                      '&.Mui-selected': {
                        backgroundColor: '#f3f3f3',
                        color: '#1976d2',
                      },
                    }}
                  />
                ))}
              </Tabs>
              <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', border: 0 }}>
                <CheckBox sx={{ mr: 2 }}></CheckBox>
                <Card variant="outlined" sx={{ pl: 2, borderRadius: 2 }}>
                  {filteredIdeas.length} selected
                  <FormDialog
                    buttonLabel={<MoreVertIcon />}
                    title="More New Ideas"
                    fields={[
                      { name: 'title', label: 'Title' },
                      { name: 'description', label: 'Description', multiline: true, rows: 4 },
                      // Thêm các field bạn muốn trong form
                    ]}
                    onSubmit={(data) => {
                      console.log('Form data submitted:', data);
                      // Xử lý gửi data ở đây, ví dụ gọi API hoặc chuyển trang
                    }}
                    buttonProps={{
                      sx: { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, m: 0 },
                      variant: 'text',
                      color: 'primary',
                      size: 'medium',
                    }}
                  />
                </Card>
              </Card>
            </Box>

            {/* Cards Grid */}
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {/* Upload Card */}
              <Grid item xs={12} sm={6} md={3} size={3}>
                <Box
                  sx={{
                    border: '2px dashed #cfd8dc',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    width: '100%',
                    height: '330px',
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                  role="button"
                  tabIndex={0}
                >
                  <input
                    type="file"
                    id="file-input"
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <IconButton>
                    <CloudUpload fontSize="large" />
                  </IconButton>
                  <Typography variant="body1">Click or drag images to create cards</Typography>
                </Box>
              </Grid>

              {/* Render ideas theo category được chọn */}
              {ideas
                .filter((item) => {
                  const selectedCategory = categories[selectedTab].label;
                  return selectedCategory === 'All' || item.category === selectedCategory;
                })
                .map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.id} size={3}>
                    <Paper
                      variant="outlined"
                      sx={{
                        padding: 2,
                        textAlign: 'center',
                        maxHeight: '330px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        padding: 0,
                        backgroundColor: '#f5f5f5',
                      }}
                    >
                      <Box
                        component="img"
                        src="/logo.png"
                        alt={item.title}
                        sx={{
                          width: '100%',
                          height: '90%',
                          objectFit: 'cover',
                          borderRadius: 1,
                          padding: 0,
                        }}
                      />
                      <Box sx={{ padding: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Typography variant="caption" color="text.primary" sx={{ fontWeight: 'bold' }}>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.category}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
            </Grid>

            {/* Pagination Footer */}
            <Paper variant="outlined" sx={{ mt: 2, p: 2, pr: 8 }}>
              <Grid container spacing={2} justifyContent="flex-end">
                <Grid item>
                  <Typography>{`1-1 of ${filteredIdeas.length} items`}</Typography>
                </Grid>
                <Grid item>
                  <Button variant="contained" size="small">
                    &lt;
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" size="small">
                    &gt;
                  </Button>
                </Grid>
                <Grid item>
                  <Typography>Page 1 of 1</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(Page);
