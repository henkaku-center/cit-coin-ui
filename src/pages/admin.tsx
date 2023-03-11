import { Container, Grid, GridItem } from '@chakra-ui/react';

const Admin = () => {
  return (
    <Grid templateColumns='350px 1fr' gap={6} width={"100%"} height={"80vh"}>
      <GridItem bg='blue.100'  height={'100%'}/>
      <GridItem bg='blue.100'  height={'100%'}/>
    </Grid>
  );
};
export default Admin;