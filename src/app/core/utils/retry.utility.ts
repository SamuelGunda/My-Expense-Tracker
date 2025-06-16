import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen, catchError, finalize } from 'rxjs/operators';


export class RetryUtility {

  static withRetry<T>(
    source: Observable<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000,
    maxDelay: number = 10000,
    backoffFactor: number = 2
  ): Observable<T> {
    let retries = 0;

    return source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap(error => {
            if (retries >= maxRetries || !RetryUtility.isRetryableError(error)) {
              return throwError(() => error);
            }

            retries++;
            const delay = Math.min(
              initialDelay * Math.pow(backoffFactor, retries - 1),
              maxDelay
            );

            console.log(`Attempt ${retries}/${maxRetries} failed. Retrying in ${delay}ms...`);

            return timer(delay);
          })
        )
      ),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => {
        if (retries > 0) {
          console.log(`Operation ${retries < maxRetries ? 'succeeded' : 'failed'} after ${retries} retries`);
        }
      })
    );
  }

  static isRetryableError(error: any): boolean {
    if (!error.status) {
      return true;
    }

    return (
      error.status >= 500 ||
      error.status === 408 ||
      error.status === 429
    );
  }
}
