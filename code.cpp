#include <bits/stdc++.h>
using namespace std;
#define ll long long int
#define T     \
    int t;    \
    cin >> t; \
    while (t--)
#define fast                          \
    ios_base::sync_with_stdio(false); \
    cin.tie(NULL);                    \
    cout.tie(NULL)
#define PI 3.141592653589793238462643383
#define pb push_back
#define all(s) s.begin(), s.end()

int main() {
    fast;

    T {
        ll n, m;
        cin >> n >> m;
        ll a[n][m];
        for (ll i = 0; i < n; i++) {
            for (ll j = 0; j < m; j++) {
                cin >> a[i][j];
            }
        }
        if (n == 1 and m == 1) {
            cout << 0 << endl;
            continue;
        }

        ll ans = 0;
        for (ll i = 0; i < n; i++) {
            for (ll j = 0; j < m; j++) {
                if (i == n / 2 and j == m / 2) continue;
                ll d = n - i - 1;
                ll r = m - j - 1;
                ll x = a[d][j];
                ll y = a[i][r];
                ll z = a[i][j];
                ll w = a[d][r];
                ;
                ll temp, kemp;

                vector<ll> v = {x, y, z, w};
                sort(all(v));
                temp = (v[1] != v[2]) ? v[1] + 1 : v[1];

                if (a[d][j] != temp) {
                    ans += abs(temp - x);
                    a[d][j] = temp;
                }
                if (a[i][j] != temp) {
                    ans += abs(temp - z);
                    a[i][j] = temp;
                }
                if (a[i][r] != temp) {
                    ans += abs(temp - y);
                    a[i][r] = temp;
                }
                if (a[d][r] != temp) {
                    ans += abs(temp - w);
                    a[d][r] = temp;
                }
            }
        }

        cout << ans << endl;
        ;
    }
}
