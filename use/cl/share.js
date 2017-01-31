
$.fn.holder.use.share = {
  url: "https://dev.api.cottagelabs.com/use/share/search",
  pushstate: false,
  datatype:"JSON",
  sticky:true,
  //fields: ['classification','gender','college','campus','disability','archive','situation','profilegrades','progresswhere', 'simd_quintile','progressions.1st_year_result','progressions.reg_1st_year','nationality','locale','date_of_birth','last_name'],
  aggs: {
    sources: { terms: { field: "sources.raw", size: 10 } }
  }  
};