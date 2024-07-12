using Polly;
using Polly.Retry;

namespace MyApp.Policy{
    public class ClassPolicy{
        public static ResiliencePipeline pipeline = new ResiliencePipelineBuilder()
            .AddRetry(new RetryStrategyOptions
            {
                ShouldHandle = new PredicateBuilder().Handle<Exception>(),
                Delay = TimeSpan.FromSeconds(8),
                MaxRetryAttempts = 3,
                BackoffType = DelayBackoffType.Constant
            })
            .Build();
    }

}