import { checkOllamaAvailability } from './model';
import { extractRequirements, fallbackExtractRequirements } from './requirement-extractor';
import { generateExplanation, fallbackGenerateExplanation } from './explanation-generator';

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('         BEAUTYPILOT PHASE 4 TEST SUITE            ');
  console.log('====================================================\n');

  // 1. Health Check
  console.log('[Test 1] Checking Ollama availability & Qwen3 model...');
  const health = await checkOllamaAvailability();
  console.log(`- Ollama Status: ${health.available ? 'AVAILABLE' : 'UNAVAILABLE'}`);
  if (health.error) console.log(`- Status Note: ${health.error}`);
  console.log('');

  // 2. Requirement Extraction Tests
  const testQueries = [
    'I need a lightweight moisturizer for oily skin under ₹1000.',
    'Gentle cleanser for sensitive skin',
    'Fragrance-free moisturizer',
    'Hydrating serum for dry skin',
    'Unclear request looking for something nice',
  ];

  console.log('[Test 2] Testing Requirement Extractor...');
  for (let i = 0; i < testQueries.length; i++) {
    const q = testQueries[i];
    console.log(`\nQuery ${i + 1}: "${q}"`);
    const result = await extractRequirements(q);
    console.log(`- Success: ${result.success}`);
    console.log(`- Used Fallback: ${result.isFallback}`);
    if (result.error) console.log(`- Error: ${result.error}`);
    console.log('- Extracted Output:', JSON.stringify(result.data, null, 2));
  }

  // 3. AI Explanation Tests (Grounded Data)
  console.log('\n[Test 3] Testing Grounded Recommendation Explanation Generator...');
  const mockSelectedProducts = [
    {
      id: 'prod-1',
      name: 'HydroBoost Gel Moisturizer',
      brand: 'Neutrogena',
      category: 'moisturizer',
      price: 850,
      size: '50ml',
      skinTypes: ['oily', 'combination'],
      concerns: ['hydration'],
      texture: 'lightweight gel',
      fragranceFree: true,
      rating: 4.6,
      description: 'Water-gel moisturizer with hyaluronic acid for oily skin.',
    },
  ];

  const mockAlternativeProducts = [
    {
      id: 'prod-2',
      name: 'Rich Nourishing Cream',
      brand: 'Nivea',
      category: 'moisturizer',
      price: 1200,
      skinTypes: ['dry'],
      rating: 4.1,
    },
  ];

  const explanationResult = await generateExplanation(
    'I need a lightweight moisturizer for oily skin under ₹1000.',
    { category: 'moisturizer', skinType: 'oily', maxPrice: 1000, texture: 'lightweight' },
    mockSelectedProducts,
    mockAlternativeProducts
  );

  console.log(`- Explanation Generated (Fallback: ${explanationResult.isFallback}):`);
  console.log(JSON.stringify(explanationResult.data, null, 2));

  // 4. Test Error / Offline Fallback Explicitly
  console.log('\n[Test 4] Verifying Deterministic Fallback Logic...');
  const fallbackExtracted = fallbackExtractRequirements('Lightweight moisturizer under ₹1000 for oily skin');
  console.log('- Fallback Requirement Output:', JSON.stringify(fallbackExtracted, null, 2));

  const fallbackExp = fallbackGenerateExplanation(
    'Lightweight moisturizer under ₹1000',
    { category: 'moisturizer', skinType: 'oily', maxPrice: 1000 },
    mockSelectedProducts,
    mockAlternativeProducts
  );
  console.log('- Fallback Explanation Output:', JSON.stringify(fallbackExp, null, 2));

  console.log('\n====================================================');
  console.log('     PHASE 4 TEST SUITE COMPLETED SUCCESSFULLY      ');
  console.log('====================================================');
}

runPhase4Tests().catch((err) => {
  console.error('Phase 4 test error:', err);
  process.exit(1);
});
