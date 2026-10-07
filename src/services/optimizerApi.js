import api from './api';

export const optimizerApi = {
  // Step 3: Analyze job requirements
  analyzeJob: async (jobData) => {
    const { data } = await api.post('/optimizer/analyze-job', jobData);
    return data;
  },

  // Step 4: Compare CV vs Job & structure candidate gaps
  detectGaps: async ({ cvId, jobId, parsedJob, jobDescription }) => {
    const { data } = await api.post('/optimizer/detect-gaps', {
      cvId,
      jobId,
      parsedJob,
      jobDescription
    });
    return data;
  },

  // Step 5: Save Candidate-Confirmed Facts
  confirmFacts: async ({ cvId, facts }) => {
    const { data } = await api.post('/optimizer/confirm-facts', { cvId, facts });
    return data;
  },

  // Fetch existing confirmed facts for a Master CV
  getConfirmedFacts: async (cvId) => {
    const { data } = await api.get(`/optimizer/confirmed-facts/${cvId}`);
    return data;
  },

  // Step 6: Run full optimization
  runOptimization: async (payload) => {
    const { data } = await api.post('/optimizer/run', payload);
    return data;
  }
};

export default optimizerApi;
