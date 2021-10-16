import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import SearchBar from "material-ui-search-bar";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Image from '../img/background.gif';
const randomImage = "https://source.unsplash.com/random";
import { fetchCatalog } from '../api/index.js';
import Cart from './Cart';





const useStyles = makeStyles((theme) => ({
    "@global": {
        main: {
            backgroundImage: `url(${Image})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            height: "100%"
        },
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
        minHeight: 600,
    },
    cardContent: {
        flexGrow: 1,
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
    },
}));
//a state, cards are the item objects in current category
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const Catalog = ({ allItems, itemImages, setCart, cart }) => {
    const classes = useStyles();
    const [catalogList, setCatalogList] = useState([]);

    const createAddToCartClicker = async (itemNumber) => {
        return async () => {
            const newCartItem = {
                qty: 1,
                itemNumber,
            }
            setCart([...cart, { ...newCartItem }]);
        };
    };
    const setupAddToCartClicker = (item) => {
        const promisedAddToCartOnClick = createAddToCartClicker(item.itemNumber);
        
        console.log("addToCartOnClick", addToCartOnClick)

        return <>
            <Button size="small" color="primary" onClick={addToCartOnClick()}>
                Add to Cart
            </Button>
        </>
    };

    useEffect(() => {
        fetchCatalog().then(items => {
            const newItems = items.map(item => {
                item.image = itemImages[item.itemNumber];
            });
            setCatalogList(items)
        })
            .catch(error => {
            });
    }, []);

    console.log(catalogList);

    const test = (card) => {
        console.log('CARD: ', card);
        console.log('CARD.IMAGE: ', card.image);
        return <>
        </>
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <main>

                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Card>
                                        <SearchBar
                                        />
                                        <div>
                                            <FormControl className={classes.formControl}>
                                                <InputLabel htmlFor="grouped-native-select">Select a Category</InputLabel>
                                                <Select native defaultValue={1} id="grouped-native-select">
                                                    <option aria-label="None" value="" />
                                                    <option value={1}>Featured</option>
                                                    <option value={2}>DC</option>
                                                    <option value={3}>Marvel</option>
                                                    <option value={4}>Iron Studios</option>
                                                    <option value={5}>Hot Toys</option>
                                                </Select>
                                            </FormControl>
                                        </div>
                                    </Card>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {/* This is where we are mapping the items */}
                        {catalogList.map((card) => (
                            <Grid item key={card.id} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    {test(card)}
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={card.image}
                                        title="Image title"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {card.name}
                                        </Typography>
                                        <Typography>
                                            {card.description}
                                        </Typography>
                                        <Typography variant="h4" component="h6">
                                            ${card.price}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                    <Button size="small" color="primary" >
                Add to Cart
            </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}

export default Catalog;