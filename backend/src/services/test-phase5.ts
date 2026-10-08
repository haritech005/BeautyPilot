import { RecommendationService } from './recommendation.service';

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('         BEAUTYPILOT PHASE 5 TEST SUITE            ');
  console.log('====================================================\n');

  const testScenarios = [
    {
      name: 'Scenario 1: Oily skin moisturizer under ₹1000',
      query: 'I have oily skin and need a lightweight moisturizer under ₹1000.',
    },
    {
      name: 'Scenario 2: Sensitive skin cleanser',
      query: 'Gentle cleanser for sensitive skin',
    },
    {
      name: 'Scenario 3: Fragrance-free moisturizer',
      query: 'Fragrance-free moisturizer',
    },
    {
      name: 'Scenario 4: Dry skin hydrating serum',
      query: 'Hydrating serum for dry skin',
    },
    {
      name: 'Scenario 5: Impossible criteria (No matching products test)',
      query: 'Nonexistent luxury gold item for dry skin under ₹1',
    },
  ];

  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`--- [Test ${i + 1}] ${scenario.name} ---`);
    console.log(`Query: "${scenario.query}"`);

    try {
      const result = await RecommendationService.getRecommendations(scenario.query);

      console.log(`- Success: ${result.success}`);
      console.log(`- Total Candidates Found: ${result.totalCandidatesFound}`);
      console.log(`- Top Recommendations Count: ${result.recommendations.length}`);
      console.log(`- Extracted Requirements:`, JSON.stringify(result.requirements, null, 2));

      if (result.recommendations.length > 0) {
        console.log(`- Top Recommended Product: ${result.recommendations[0].product.name} (Brand: ${result.recommendations[0].product.brand}, Price: ₹${result.recommendations[0].product.price}, Score: ${result.recommendations[0].score})`);
        console.log(`- Explanation why recommended: ${result.recommendations[0].explanation?.whyRecommended}`);
        console.log(`- Comparison Notes: ${result.recommendations[0].explanation?.comparisonNotes}`);
      } else {
        console.log(`- Result Overview: ${result.overview}`);
      }
    } catch (err: any) {
      console.error(`- Scenario ${i + 1} Failed: ${err.message || String(err)}`);
    }

    console.log('\n');
  }

  console.log('====================================================');
  console.log('     PHASE 5 TEST SUITE COMPLETED SUCCESSFULLY      ');
  console.log('====================================================');
}

runPhase5Tests().catch((err) => {
  console.error('Phase 5 test execution error:', err);
  process.exit(1);
});
