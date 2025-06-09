import { useState } from 'react';
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
import { CloudUpload } from '@mui/icons-material';
import Link from 'next/link';
import { Seo } from 'src/components/seo';
import Header from 'src/components/header';
import Sidebar from 'src/components/sidebar';

// MOCK DATA
const ideas = [
  {
    id: 1,
    title: 'Idea 1',
    category: 'Draft',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 2,
    title: 'Idea 2',
    category: 'New',
    category: 'Doing',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 3,
    title: 'Idea 3',
    category: 'Todo',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 4,
    title: 'Idea 4',
    category: 'Todo',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 5,
    title: 'Idea 5',
    category: 'Doing',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 6,
    title: 'Idea 6',
    category: 'New',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 7,
    title: 'Idea 7',
    category: 'New',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 8,
    title: 'Idea 8',
    category: 'Doing',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 9,
    title: 'Idea 9',
    category: 'Done',
    category: 'Doing',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 10,
    title: 'Idea 10',
    category: 'New',
    category: 'Doing',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 11,
    title: 'Idea 11',
    category: 'Todo',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
  },
  {
    id: 12,
    title: 'Idea 12',
    category: 'Todo',
    description: 'This is a great idea.',
    imageUrl: '/logo.png',
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
const getCategoryCounts = () => {
  const counts = categoryList.map((label) => ({
    label,
    count: label === 'All' ? ideas.length : ideas.filter((i) => i.category === label).length,
  }));
  return counts;
};

// MAIN PAGE
const Page = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const categories = getCategoryCounts();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const selectedCategory = categories[selectedTab].label;
  const filteredIdeas = selectedCategory === 'All' ? ideas : ideas.filter((i) => i.category === selectedCategory);

  const handleFileChange = (event) => {
    const files = event.target.files;
    console.log('Files selected:', files);
  };

  return (
    <>
      <Seo title="Ideas" />
      <Header />
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
                    <Button
                      sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, m: 0 }}
                      variant="contained"
                      color="primary"
                      size="medium"
                      component={Link}
                      href="/ideas/create"
                    >
                      Create Idea
                    </Button>
                    <Button
                      sx={{ width: '4px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      variant="contained"
                      color="primary"
                      size="large"
                      component={Link}
                      href="/ideas/create"
                    >
                      :
                    </Button>
                  </Grid>

                  {/* 2. App Bar Section */}
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
                      placeholder="Search..."
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
                    <Button variant="contained">More filters</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Tabs */}
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

export default Page;
