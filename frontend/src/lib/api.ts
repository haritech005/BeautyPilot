import { RecommendationApiResponse } from '@/types/recommendation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchRecommendations(query: string): Promise<RecommendationApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error ${response.status}: Failed to fetch recommendations.`);
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
      throw new Error(
        `Backend server is unreachable at ${API_BASE_URL}. Please start the backend server by running 'npm run dev' inside the backend directory.`
      );
    }
    throw err;
  }
}
