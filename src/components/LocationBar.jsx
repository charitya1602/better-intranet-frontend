import { Breadcrumbs, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
const truncate = (string, len, dots = "...") => {
  return string.length > len
    ? `${string.substr(0, len - dots.length)}${dots}`
    : string;
};

const LocationBar = ({ location }) => {
  if(location.lenght == 0) return null;
  return (
    <Box
      sx={{
        marginLeft: '260px',
        marginTop: 10,
      }}
    >
      <Breadcrumbs>
        {location.map((e) => (
          <Link
            key={e.name}
            underline="hover"
            color="inherit"
            to={"hello"}
            
          >
            {truncate(e.name, 18)}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default LocationBar;
