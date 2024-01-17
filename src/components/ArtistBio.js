useEffect(() => {
    const fetchBio = async () => {
    const mbApiUrl = "https://musicbrainz.org/ws/2/";
    let searchParam = artistName;
   
    // First, search for the artist to get their MBID
    const searchParams = new URLSearchParams({
     fmt: "json",
     query: `artist:"${searchParam}"`,
     dismax: "true",
     limit: "1",
    });
   
    try {
     const response = await fetch(`${mbApiUrl}artist/?${searchParams}`, {
       headers: {
         'User-Agent': 'Music Database App/1.0 ( kylejohnchin33@gmail.com )',
       },
     });
     const data = await response.json();
     const artist = data.artists[0];
   
     // Then, use the artist's MBID to fetch their details
     const detailParams = new URLSearchParams({
       fmt: "json",
       inc: "url-rels+annotation",
     });
   
     const detailResponse = await fetch(`${mbApiUrl}artist/${artist.id}?${detailParams}`, {
       headers: {
         'User-Agent': 'Music Database App/1.0 ( kylejohnchin33@gmail.com )',
       },
     });
     const detailData = await detailResponse.json();
     const annotation = detailData.artist?.annotation;
   
     if (annotation && annotation.summary) {
       setArtistBio(annotation.summary);
     } else {
       setArtistBio("Sorry, no biography found.");
     }
    } catch (error) {
     console.error("Error fetching data: ", error);
     setArtistBio("Error fetching biography.");
    }
    };
   
    fetchBio();
   }, [artistName, setArtistBio]);
   