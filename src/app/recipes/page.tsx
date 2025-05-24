'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper, 
  CircularProgress, 
  Alert,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  [key: string]: string | null;
}

export default function RecipePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Fetch recipes based on search term
  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes', search],
    queryFn: async () => {
      if (!search) return { meals: [] };
      
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      
      return response.json();
    },
    enabled: !!search,
  });

  const handleSearch = () => {
    setSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Extract ingredients and measures from recipe
  const getIngredients = (recipe: Recipe) => {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient,
          measure: measure || '',
        });
      }
    }
    
    return ingredients;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push('/')}
            aria-label="back"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recipe Search
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Search for Recipes
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              label="Enter a meal name"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={!searchTerm}
            >
              Search
            </Button>
          </Box>
          
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error fetching recipes: {String(error)}
            </Alert>
          )}
          
          {data && !data.meals && search && !isLoading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No recipes found for "{search}". Try another search term.
            </Alert>
          )}
          
          {data && data.meals && data.meals.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Search Results for "{search}"
              </Typography>
              
              {data.meals.map((recipe: Recipe) => (
                <Paper key={recipe.idMeal} sx={{ mb: 4, p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {recipe.strMeal}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                    Ingredients:
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ingredient</TableCell>
                          <TableCell>Measure</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {getIngredients(recipe).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.ingredient}</TableCell>
                            <TableCell>{item.measure}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Instructions:
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {recipe.strInstructions}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Container>
      
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Collaborative Task Manager
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
