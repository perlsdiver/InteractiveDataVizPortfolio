# Interactive Data Visualization Portfolio
Portfolio for Interactive Data Visualization (Spring 2023)
Ian Williams

This portfolio has has three components

1. Updated tutorial
2. Compiled final
3. Reflection on the process

**Abstract for updated tutorial**

This visualization demonstrates how to make an area chart with a small data set, with a tooltip. It depicts annual population estimates of persons experiencing homelesssness in the United States from 2007-2022.

**Abstract for final project**

This project takes a sample of the US Census Bureau's 2020 American Community Survey data and renders an interactive map of New York City. Focusing on housing characteristics, it introduces the viewer to the work of the Plumbing Poverty Project. It then offers the viewer an opportunity to explore tract-level estimates of proportions of inadequate plumbing in occupied buildings, visually depicted as a choropleth map. The viewer is invited to submit a reflection on the observations and experiences through an embedded Google form.

##### **3. Reflection**

Returning to class the objectives, here is where I feel I stand:

- [x] Understand the basics of web development, using HTML, JS, and CSS.
- [ ] Build custom data-driven graphics using d3.js.
- [ ] Incorporate interactivity to enhance engagement and understanding.
- [x] Build the foundation of a data visualization portfolio.

I am still working on the techincal aspects of d3.js, which means I have not yet incorporated interactivity.

I saw [this meme](https://www.facebook.com/photo/?fbid=139588109105085&set=gm.10160358566740469&idorvanity=71041660468) on the Facebook group, 'Reviewer 2 Must Be Stopped!' and thought it was appropriate. Swap out my vision for what my project could be, and where it landed with my ability to execute the code at the point of this reflection.

![Research meme](/data/r2_research_paper_meme.jpeg)

**Challenges**

This class was incredibly challenging for me, the greatest difficulty being maintaining enough of a working grasp of JavaScript syntax to make my d3.js code work. I learned a significant quantity of new information and was exposed to ways of thinking that were far outside of my discipline or learning scope.  I got to meet and connect with students from two very intersting Master's programs at The Graduate Center, and I got to learn from a professional information designer and visualization expert. I was also exposed to several creative practices and ideational tools that I was unaware of. So in that regard, this class was a 'success,' but I feel that where I currently stand, I have failed to grasp some fundamentals and properly execute the code. That is a little deflating.

In retrospect, perhaps I should have taken some time to learn JavaScript ahead of time, or recruited additional support earlier on to help me stay on track. As a student in a Ph.D. program at The Graduate Center, I was on a waitlist for registration and notified of my eligiblity for the class while on my honeymoon - only a few days before I returned to NYC, right before the Spring semester. Prior to notification, I had mapped out an alternative course path for the semester. But the opportunity to take this class and gain hands-on exposure to d3.js was hard to pass up, though perhaps my interest was more in learning about how d3 works and how it functions as a tool that people use (and in that regard, perhaps I was paying more attention, unconsciously, to the class discussion and dynamics than the technical instruction?). So my output reflected this rough starting point, lack of familiarity with the foundations, and a very busy semester with many time commimtents and a few difficult life events that impacted my studies.

**Data selection and design choices**

For my project, I decided to stay with the assigned data set - the US Census Bureau's 2020 American Community Survey. My design choices for my project were relatively rudimentary and not always the most deliberate; I wanted, basically, to replicate things I saw on the US Census website and the way data was rendered. I chose things that seemed interesting to me, and that could 'work'. But I also may have locked myself into a pre-existing need to make it work for an applied purpose (as a pedagogical too for a class I am teaching this summer on social welfare policy and homelessness for MSW students), and that likely distracted me somewhat from working with the data on its own terms (and thus letting the 'shape' emerge naturally). I initially wanted to hone in for the final on possible indicators or representations of homelessness. Data visualization, and information design, are not core parts of the social work curriculum. They are increasingly important to how information is structured and consumed. So I wanted to give it a try as a proof of concept for a larger idea about incorporation intentional information visualization design as a pedagogical tool.

My initial question about homelessness changed after I attended the NYC School of Data in March 2023, where I met an employee of the US Census Bureau who works in public education. A geographer by training, he was quite skilled in map exploration. I asked him my question about homelessness and he mentioned there are instances where there might be a population count assigned to a park, but it's very case by case. He said he'd look into some other data fields, and then got back to me by email suggesting I look at "tenure by plumbing", in Table 2509 for the ACS Five-Year Estimates. This data, organized at the tract level, indicated whether or not occupied buildings had adequate plumbing and kitchen faciliities. I explored this data and found it quite intriguing, so I decided to run with it as it fits my overall narrative connecting homelessness to housing conditions. I imagined creating a simple map of NYC, that would somehow visualize densities. Ideally, I would split the map into two renderings: one showing the proportion of owner-occupied housing with inadequate plumbing, and one showing the total of renter-occupied housing with inadquate plumbing.

Through researching online and watching some YouTube videos, I learned that what I wanted to render was a choropleth map. This type of map uses shading to represent density and distribution within a defined geographic area. More sophisticated versions include bivariate or multivariate, which my data set could render, but I was not able to acheive this. I spent a fair amount of time wrangling the data and preprocessing it - the Census default format has its own syntax and code structure that took some massaging to align it with with GeoJSON data I sourced from NYC Open Data for the base layer map.

I wanted to construct my visualization project as an object for exploration, and an experience that would invite reflection. Initially, that meant framing the visualization with more social theory - partulary some essays I really enjoyed about the politics of data visualization in academia and society:

- Boehnert, J. (2016). Data visualisation does political things. DRS2016: Design+ research+ society: Future-focused thinking.

- Kennedy, H., & Hill, R. L. (2017). The pleasure and pain of visualizing data in times of data power. Television & New Media, 18(8), 769-782.

Perhaps, though, that was not the right starting point for a technical demonstration. Looking back at the process, I would have liked to incorporate some of the design activities earlier on in the semester, and to have played around with assigned data set (or identifying a data set) from the first few weeks. Although the class did not focus on data wrangling and transformations, it would have helped to practice that (or see an example of preprocessed/pre-wrangled Census data) in our earlier tutorials, to start thinking about how to work with and transform it.

I settled on framing things a bit more empirically, framing my map as a small visual window into a much bigger picture compiled by the [Plumbing Poverty Project](https://www.theguardian.com/us-news/2021/sep/27/water-almost-half-million-us-households-lack-indoor-plumbing), who research plumbing in census data, and this 'hidden' form of poverty that is estimated to affect almost 500,000 people living in the United States.

**Class feedback**

Class feedback in the initial presentation helped me to imagine how I might co-present demographic data to offer a fuller picture of what the counts of inadequate plumbing when. Demographic analysis was less foregrounded in my approach, although I imagined how it might make for an interesting intersection between the built environment and population characteristics. I also received suggestions about adding a tooltip and some other interactive features I had not considered.

Another part of our peer demonstrations was getting to see my classmates' design processes, including their iterations, their code snippets, and their mock-ups. It helped me to imagine different ways of putting together my project, as well as how users might interact with it. Offering feedback on theirs, as well, helped me feel a little more confident - that my ability to contribute was not limited to my techinical skill level.

